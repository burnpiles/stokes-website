import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shortsTable = pgTable("shorts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  views: text("views").notNull().default(""),
  youtubeUrl: text("youtube_url").notNull().default(""),
  thumbnailUrl: text("thumbnail_url").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertShortSchema = createInsertSchema(shortsTable).omit({ id: true });
export type InsertShort = z.infer<typeof insertShortSchema>;
export type Short = typeof shortsTable.$inferSelect;
