import { pgTable, uuid, char, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects_members } from './project_members';

export const user = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  first_name: varchar({ length: 80 }).notNull(),
  last_name: varchar({ length: 80 }).notNull(),
  initials: varchar({ length: 10 }).notNull(),
  color_hex: char({ length: 7 }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  projects_members: many(projects_members),
}));
