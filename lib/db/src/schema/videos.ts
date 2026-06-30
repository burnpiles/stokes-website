import { boolean, pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const videosTable = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  tags: text("tags").array().notNull().default([]),
  views: text("views").notNull().default(""),
  duration: text("duration").notNull().default(""),
  youtubeUrl: text("youtube_url").notNull().default(""),
  thumbnailUrl: text("thumbnail_url").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertVideoSchema = createInsertSchema(videosTable).omit({ id: true });
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videosTable.$inferSelect;
