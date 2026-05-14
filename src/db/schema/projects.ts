import { pgTable, uuid, char, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user } from './schema';
import { relations } from 'drizzle-orm';
import { projects_members } from './project_members';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar({ length: 120 }).notNull(),
  color_hex: char({ length: 7 }).notNull(),
  owner_id: uuid('owner_id')
    .references(() => user.id)
    .notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  projects_members: many(projects_members),
}));
