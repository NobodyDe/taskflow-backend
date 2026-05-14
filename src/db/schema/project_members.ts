import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { user } from './schema';
import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';

export const projects_members = pgTable(
  'projects_members',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projects_id: uuid('projects_id')
      .references(() => projects.id)
      .notNull(),
    users_id: uuid('users_id')
      .references(() => user.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.users_id, t.projects_id] })],
);

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
