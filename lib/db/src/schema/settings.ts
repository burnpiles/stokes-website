import { integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";

export interface SiteSettings {
  hero: {
    eyebrow: string;
    tagline: string;
    ctaLabel: string;
    ctaHref: string;
  };
  marqueeText: string;
  socials: {
    tiktok: { value: string; url: string };
    youtube: { value: string; url: string };
    instagram: { value: string; url: string };
  };
  youtubeCounter: {
    base: number;
    target: number;
    perMinute: number;
    anchorIso: string;
    subLabel: string;
  };
  statsSection: { eyebrow: string; headline: string; description: string };
  youtubeSection: { eyebrow: string; headline: string; description: string };
  networkSection: { eyebrow: string; headline: string; description: string };
  demographicsSection: {
    eyebrow: string;
    headline: string;
    sourceNote: string;
    ageSubcopy: string;
    genderSubcopy: string;
    geographySubcopy: string;
    deviceSubcopy: string;
  };
  partnerSection: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    email: string;
    mediaKitUrl: string;
    brandsLogline: string;
    showBrandModal: boolean;
  };
  careersSection: { eyebrow: string; headline: string; body: string };
  footer: { description: string; copyright: string; slogan: string };
  sectionVisibility?: {
    numbers: boolean;
    youtube: boolean;
    channels: boolean;
    demographics: boolean;
    partner: boolean;
    careers: boolean;
  };
}

export const settingsTable = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  data: jsonb("data").$type<SiteSettings>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Settings = typeof settingsTable.$inferSelect;
