import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  unique,
  pgEnum,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 100 }).notNull(),

  age: integer("age").notNull(),

  email: varchar("email", { length: 150 }).notNull().unique(),

  password: text("password").notNull(),

  // Added role column to support Admin functionality
  role: varchar("role", { length: 20 }).default("user").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    summary: varchar("summary", { length: 100 }).notNull(),

    details: text("details"),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIndex: index("tasks_user_idx").on(table.userId),
  }),
);

export const tagNameEnum = pgEnum("tag_name", ["UI/UX", "FE", "BE", "DevOps"]);

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: tagNameEnum("name").notNull(),

  color: varchar("color", { length: 50 }).notNull(),
});

export const taskTags = pgTable(
  "task_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),

    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueTaskTag: unique().on(table.taskId, table.tagId),
    taskIndex: index("task_tags_task_idx").on(table.taskId),
    tagIndex: index("task_tags_tag_idx").on(table.tagId),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  taskTags: many(taskTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  taskTags: many(taskTags),
}));

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [taskTags.tagId],
    references: [tags.id],
  }),
}));

export type NewUser = typeof users.$inferInsert;

export const insertUserSchema = createInsertSchema(users);

// This creates a schema that ONLY allows email and password
export const loginSchema = insertUserSchema.pick({
  email: true,
  password: true,
});
