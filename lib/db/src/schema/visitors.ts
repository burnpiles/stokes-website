import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const visitorsTable = pgTable("visitors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  firstAccessedAt: timestamp("first_accessed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  successfulAccessCount: integer("successful_access_count").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertVisitorSchema = createInsertSchema(visitorsTable).omit({
  id: true,
  firstAccessedAt: true,
  lastAccessedAt: true,
  successfulAccessCount: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitorsTable.$inferSelect;
