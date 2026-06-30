import { pgTable, real, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const statsTable = pgTable("stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: real("value").notNull(),
  suffix: text("suffix").notNull().default(""),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertStatSchema = createInsertSchema(statsTable).omit({ id: true });
export type InsertStat = z.infer<typeof insertStatSchema>;
export type Stat = typeof statsTable.$inferSelect;
