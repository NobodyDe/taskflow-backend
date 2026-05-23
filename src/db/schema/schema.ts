import { pgTable, char, timestamp, varchar, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects_members } from './project_members';
import { ulid } from 'ulid';
import { cards } from './card';

export const user = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => ulid()),
  first_name: varchar({ length: 80 }).notNull(),
  last_name: varchar({ length: 80 }).notNull(),
  initials: varchar({ length: 10 }).notNull(),

  position: varchar({ length: 80 }).notNull(),
  color_hex: char({ length: 7 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password_hash: varchar({ length: 255 }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  projects_members: many(projects_members),
  created_cards: many(cards, { relationName: 'card_creator' }),
  assigned_cards: many(cards, { relationName: 'card_assignee' }),
}));
