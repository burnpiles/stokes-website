import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const platformsTable = pgTable("platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  handle: text("handle").notNull().default(""),
  color: text("color").notNull().default("#FFFFFF"),
  iconKey: text("icon_key").notNull(),
  url: text("url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPlatformSchema = createInsertSchema(platformsTable).omit({
  id: true,
});
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;
export type Platform = typeof platformsTable.$inferSelect;
