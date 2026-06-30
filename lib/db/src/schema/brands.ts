import { jsonb, pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export interface BrandStat {
  label: string;
  value: string;
}

export const brandsTable = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull().default(""),
  campaign: text("campaign").notNull().default(""),
  formats: text("formats").notNull().default(""),
  quote: text("quote").notNull().default(""),
  stats: jsonb("stats").$type<BrandStat[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertBrandSchema = createInsertSchema(brandsTable).omit({ id: true });
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brandsTable.$inferSelect;
