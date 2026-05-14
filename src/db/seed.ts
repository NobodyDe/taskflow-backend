import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL não definida');
}

const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema });

async function main(): Promise<void> {
  await db.transaction(async (tx) => {
    const [owner] = await tx
      .insert(schema.user)
      .values({
        first_name: 'Henrique',
        last_name: 'Santos',
        initials: 'HS',
        color_hex: '#3366CC',
      })
      .returning({ id: schema.user.id });

    if (!owner) {
      throw new Error('Falha ao criar usuário seed');
    }

    const [project] = await tx
      .insert(schema.projects)
      .values({
        name: 'Dashboard v2',
        color_hex: '#22C55E',
        owner_id: owner.id,
      })
      .returning({ id: schema.projects.id });

    if (!project) {
      throw new Error('Falha ao criar projeto seed');
    }

    await tx.insert(schema.projects_members).values({
      projects_id: project.id,
      users_id: owner.id,
    });
  });

  console.log(
    'Seed concluído: usuário dono, projeto e vínculo em projects_members.',
  );
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
