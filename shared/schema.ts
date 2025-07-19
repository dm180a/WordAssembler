import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const morphemes = pgTable("morphemes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  type: text("type").notNull(), // 'prefix', 'root', 'suffix'
  definition: text("definition").notNull(),
  examples: jsonb("examples").$type<string[]>().notNull().default([]),
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull().unique(),
  definition: text("definition").notNull(),
  components: jsonb("components").$type<{
    prefix?: string;
    root: string;
    suffix?: string;
  }>().notNull(),
});

export const insertMorphemeSchema = createInsertSchema(morphemes).omit({
  id: true,
});

export const insertWordSchema = createInsertSchema(words).omit({
  id: true,
});

export type InsertMorpheme = z.infer<typeof insertMorphemeSchema>;
export type Morpheme = typeof morphemes.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof words.$inferSelect;
