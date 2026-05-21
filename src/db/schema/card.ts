import { sql } from 'drizzle-orm';

import { text, pgTable, varchar } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { user } from './schema';
import { timestamp } from 'drizzle-orm/pg-core';
import { columns } from './columns';
import { integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', [
  'critical',
  'high',
  'medium',
  'low',
]);

export const cards = pgTable('cards', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => ulid()),
  title: varchar({ length: 80 }).notNull(),
  description: varchar({ length: 80 }),
  priority: priorityEnum(),
  tags: text('tags1')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  created_by: text('created_by')
    .references(() => user.id)
    .notNull(),
  dueDate: timestamp('dueDate', { mode: 'string' }).notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  created_at: timestamp('created_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
  column_id: text('column_id')
    .references(() => columns.id)
    .notNull(),
  assigned_to: text('assigned_to').references(() => user.id),
  position: integer('position').notNull().default(0),
  attachments: integer('attachments').default(0),
  comments: integer('comments').default(0),
});

export const cardsRelations = relations(cards, ({ one }) => ({
  column: one(columns, {
    fields: [cards.column_id],
    references: [columns.id],
    // SEM relationName — não há ambiguidade entre cards e columns
  }),
  creator: one(user, {
    fields: [cards.created_by],
    references: [user.id],
    relationName: 'card_creator', // pareia com created_cards no userRelations
  }),
  assignee: one(user, {
    fields: [cards.assigned_to],
    references: [user.id],
    relationName: 'card_assignee',
  }),
}));
