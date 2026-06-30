import { boolean, pgTable, real, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const demographicsTable = pgTable("demographics", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  label: text("label").notNull(),
  percent: real("percent").notNull(),
  highlight: boolean("highlight").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertDemographicSchema = createInsertSchema(demographicsTable).omit({
  id: true,
});
export type InsertDemographic = z.infer<typeof insertDemographicSchema>;
export type Demographic = typeof demographicsTable.$inferSelect;
