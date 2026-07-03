import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pressTable = pgTable("press", {
  id: serial("id").primaryKey(),
  outlet: text("outlet").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPressItemSchema = createInsertSchema(pressTable).omit({ id: true });
export type InsertPressItem = z.infer<typeof insertPressItemSchema>;
export type PressItem = typeof pressTable.$inferSelect;
