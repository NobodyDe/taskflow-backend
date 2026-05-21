import { ulid } from 'ulid';
import { projects } from './projects';
import { user } from './schema';
import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { cards } from './card';

export const columns = pgTable('columns', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => ulid()),
  projects_id: text('projects_id')
    .references(() => projects.id)
    .notNull(),
  name: varchar({ length: 80 }).notNull(),
  color_hex: varchar({ length: 7 }).notNull(),
  position: integer('position').notNull(),
  create_by: text('create_by')
    .references(() => user.id)
    .notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const columnsRelations = relations(columns, ({ one, many }) => ({
  projects: one(projects, {
    fields: [columns.projects_id],
    references: [projects.id],
  }),
  cards: many(cards),
}));
