import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { user } from './schema';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const projects_members = pgTable('projects_members', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => ulid()),
  projects_id: text('projects_id')
    .references(() => projects.id)
    .notNull(),
  users_id: text('users_id')
    .references(() => user.id)
    .notNull(),
});

export const projectsMembersRelations = relations(
  projects_members,
  ({ one }) => ({
    users: one(user, {
      fields: [projects_members.users_id],
      references: [user.id],
    }),
    projects: one(projects, {
      fields: [projects_members.projects_id],
      references: [projects.id],
    }),
  }),
);
