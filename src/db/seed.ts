import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL não definida');
}

const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema });

async function main(): Promise<void> {
  // ✅ Gera os hashes FORA da transaction (operação CPU-intensive)
  const henriqueHash = await bcrypt.hash('senha123', 10);
  const mariaHash = await bcrypt.hash('senha456', 10);

  await db.transaction(async (tx) => {
    await tx.execute(
      sql`TRUNCATE users, projects, projects_members, columns, cards CASCADE`,
    );

    // ─── Criar Usuários ───────────────────────────────────────────
    const [henrique, maria] = await tx
      .insert(schema.user)
      .values([
        {
          first_name: 'Henrique',
          last_name: 'Santos',
          initials: 'HS',
          color_hex: '#3366CC',
          position: 'Developer',
          email: 'henrique@email.com',
          password_hash: henriqueHash,
        },
        {
          first_name: 'Maria',
          last_name: 'Oliveira',
          initials: 'MO',
          color_hex: '#EF4444',
          position: 'Designer',
          email: 'maria@email.com',
          password_hash: mariaHash,
        },
      ])
      .returning({ id: schema.user.id });

    if (!henrique || !maria) {
      throw new Error('Falha ao criar usuários seed');
    }

    // ─── Projetos do Henrique ─────────────────────────────────────
    const [dashboardV2, mobileApp] = await tx
      .insert(schema.projects)
      .values([
        {
          name: 'Dashboard v2',
          description:
            'Complete redesign of the main dashboard with new features',
          color_hex: '#22C55E',
          owner_id: henrique.id,
        },
        {
          name: 'Mobile App',
          description: 'iOS and Android native application',
          color_hex: '#8B5CF6',
          owner_id: henrique.id,
        },
      ])
      .returning({ id: schema.projects.id, name: schema.projects.name });

    // ─── Projeto da Maria ─────────────────────────────────────────
    const [designSystem] = await tx
      .insert(schema.projects)
      .values({
        name: 'Design System',
        description: 'Component library and design tokens for the platform',
        color_hex: '#F59E0B',
        owner_id: maria.id,
      })
      .returning({ id: schema.projects.id, name: schema.projects.name });

    if (!dashboardV2 || !mobileApp || !designSystem) {
      throw new Error('Falha ao criar projetos seed');
    }

    // ─── Membros dos Projetos ─────────────────────────────────────
    await tx.insert(schema.projects_members).values([
      { projects_id: dashboardV2.id, users_id: henrique.id },
      { projects_id: mobileApp.id, users_id: henrique.id },
      { projects_id: designSystem.id, users_id: maria.id },
    ]);

    // ─── Colunas do Henrique (3 no Dashboard v2) ──────────────────
    const henriqueColumns = await tx
      .insert(schema.columns)
      .values([
        {
          name: 'To Do',
          color_hex: '#EF4444',
          position: 0,
          projects_id: dashboardV2.id,
          create_by: henrique.id,
        },
        {
          name: 'In Progress',
          color_hex: '#F59E0B',
          position: 1,
          projects_id: dashboardV2.id,
          create_by: henrique.id,
        },
        {
          name: 'Done',
          color_hex: '#22C55E',
          position: 2,
          projects_id: dashboardV2.id,
          create_by: henrique.id,
        },
      ])
      .returning({ id: schema.columns.id, name: schema.columns.name });

    const colTodo = henriqueColumns.find((c) => c.name === 'To Do');
    const colInProgress = henriqueColumns.find((c) => c.name === 'In Progress');
    const colDone = henriqueColumns.find((c) => c.name === 'Done');

    if (!colTodo || !colInProgress || !colDone) {
      throw new Error('Falha ao localizar colunas do Henrique');
    }

    // ─── Coluna da Maria (1 no Design System) ─────────────────────
    const [mariaColumn] = await tx
      .insert(schema.columns)
      .values({
        name: 'Backlog',
        color_hex: '#6B7280',
        position: 0,
        projects_id: designSystem.id,
        create_by: maria.id,
      })
      .returning({ id: schema.columns.id });

    if (!mariaColumn) {
      throw new Error('Falha ao criar coluna da Maria');
    }

    // ─── Cards do Henrique (3 distribuídos) ───────────────────────
    await tx.insert(schema.cards).values([
      {
        title: 'Configurar ambiente de dev',
        description: 'Instalar Docker, PostgreSQL e rodar migrations',
        position: 0,
        column_id: colTodo.id,
        created_by: henrique.id,
        dueDate: '2026-05-20 00:00:00',
      },
      {
        title: 'Implementar autenticação JWT',
        description: 'Passport + JWT strategy com refresh token',
        position: 0,
        column_id: colInProgress.id,
        created_by: henrique.id,
        dueDate: '2026-05-25 00:00:00',
      },
      {
        title: 'Criar repositório Git',
        description: 'Inicializar repo, configurar .gitignore e push inicial',
        position: 0,
        column_id: colDone.id,
        created_by: henrique.id,
        dueDate: '2026-05-10 00:00:00',
      },
    ]);

    // ─── Card da Maria (1 card) ───────────────────────────────────
    await tx.insert(schema.cards).values({
      title: 'Criar paleta de cores',
      description: 'Definir cores primárias, secundárias e neutras',
      position: 0,
      column_id: mariaColumn.id,
      created_by: maria.id,
      dueDate: '2026-06-01 00:00:00',
    });
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('   → 2 usuários (Henrique: senha123 | Maria: senha456)');
  console.log('   → 3 projetos (Dashboard v2 + Mobile App + Design System)');
  console.log('   → 3 colunas no Dashboard v2, 1 no Design System');
  console.log('   → 3 cards do Henrique, 1 card da Maria');
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
