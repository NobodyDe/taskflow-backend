import { pgTable, char, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user } from './schema';
import { relations } from 'drizzle-orm';
import { projects_members } from './project_members';
import { ulid } from 'ulid';
import { text } from 'drizzle-orm/pg-core';
import { columns } from './columns';

export const projects = pgTable('projects', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => ulid()),
  name: varchar({ length: 120 }).notNull(),
  color_hex: char({ length: 7 }).notNull(),
  owner_id: text('owner_id')
    .references(() => user.id)
    .notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
});

export const projectsRelations = relations(projects, ({ many, one }) => ({
  owner: one(user, {
    fields: [projects.owner_id],
    references: [user.id],
  }),
  projects_members: many(projects_members),
  columns: many(columns),
}));
