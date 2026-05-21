import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL não definida');
}

const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema });

async function main(): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`TRUNCATE users, projects, projects_members, columns, cards CASCADE`,
    );
    // criar usuario
    const [owner] = await tx
      .insert(schema.user)
      .values({
        first_name: 'Henrique',
        last_name: 'Santos',
        initials: 'HS',
        color_hex: '#3366CC',
        position: 'Developer',
      })
      .returning({ id: schema.user.id });

    if (!owner) {
      throw new Error('Falha ao criar usuário seed');
    }

    const [projectMain, projectEmpty] = await tx
      .insert(schema.projects)
      .values([
        { name: 'Dashboard v2', color_hex: '#22C55E', owner_id: owner.id },
        {
          name: 'Landing Page',
          color_hex: '#8B5CF6',
          owner_id: owner.id,
        },
      ])
      .returning({ id: schema.projects.id, name: schema.projects.name });

    if (!projectMain || !projectEmpty) {
      throw new Error('Falha ao criar projeto seed');
    }

    await tx.insert(schema.projects_members).values([
      { projects_id: projectMain.id, users_id: owner.id },
      { projects_id: projectEmpty.id, users_id: owner.id },
    ]);

    // cria as colunas

    const insertedColumns = await tx
      .insert(schema.columns)
      .values([
        {
          name: 'Backlog',
          color_hex: '#6B7280',
          position: 0,
          projects_id: projectMain.id,
          create_by: owner.id,
        },
        {
          name: 'To Do',
          color_hex: '#EF4444',
          position: 1,
          projects_id: projectMain.id,
          create_by: owner.id,
        },
        {
          name: 'In Progress',
          color_hex: '#F59E0B',
          position: 2,
          projects_id: projectMain.id,
          create_by: owner.id,
        },
        {
          name: 'Review',
          color_hex: '#3B82F6',
          position: 3,
          projects_id: projectMain.id,
          create_by: owner.id,
        },
        {
          name: 'Done',
          color_hex: '#22C55E',
          position: 4,
          projects_id: projectMain.id,
          create_by: owner.id,
        },
      ])
      .returning({ id: schema.columns.id, name: schema.columns.name });

    // criar cards distribuidos nas colunas

    const colTodo = insertedColumns.find((c) => c.name === 'To Do');
    const colInProgress = insertedColumns.find((c) => c.name === 'In Progress');
    const colDone = insertedColumns.find((c) => c.name === 'Done');

    if (!colTodo || !colInProgress || !colDone) {
      throw new Error('Falha ao localizar colunas para seed de cards');
    }

    await tx.insert(schema.cards).values([
      {
        title: 'Configurar ambiente de dev',
        description: 'Instalar Docker, PostgreSQL e rodar migrations',
        position: 0,
        column_id: colTodo.id,
        created_by: owner.id,
        dueDate: '2026-05-20 00:00:00',
      },
      {
        title: 'Implementar autenticação JWT',
        description: 'Passport + JWT strategy com refresh token',
        position: 0,
        column_id: colInProgress.id,
        created_by: owner.id,
        dueDate: '2026-05-25 00:00:00',
      },
      {
        title: 'Criar repositório Git',
        description: 'Inicializar repo, configurar .gitignore e push inicial',
        position: 0,
        column_id: colDone.id,
        created_by: owner.id,
        dueDate: '2026-05-10 00:00:00',
      },
    ]);
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('   → 1 usuário');
  console.log('   → 2 projetos (Dashboard v2 + Landing Page)');
  console.log('   → 5 colunas no Dashboard v2, 0 na Landing Page');
  console.log('   → 3 cards distribuídos nas colunas');
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
