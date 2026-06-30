import React, { useState } from "react";
import type { Settings } from "@workspace/api-client-react";
import { TextField, TextAreaField, NumberField, BoolField, adminCardCls, adminBtnPrimary } from "./AdminPrimitives";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={adminCardCls}>
      <h3 className="font-mono text-[11px] tracking-[0.2em] text-[#E13B2C] uppercase mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export function SettingsEditor({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => Promise<unknown> }) {
  const [draft, setDraft] = useState<Settings>(() => structuredClone(settings));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function patch<K extends keyof Settings>(key: K, value: Settings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await onSave(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  const s = draft;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl text-[#F4F1EA] mb-1">Site Settings</h2>
          <p className="font-sans text-sm text-[#F4F1EA]/50">Copy, section headings, socials, and the live counter.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="font-mono text-[11px] text-[#E8B547]">✓ Saved</span>}
          <button type="button" className={adminBtnPrimary} disabled={saving} onClick={save}>
            {saving ? "SAVING…" : "SAVE SETTINGS"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Section title="Hero">
          <TextField label="Eyebrow" value={s.hero.eyebrow} onChange={(v) => patch("hero", { ...s.hero, eyebrow: v })} full />
          <TextAreaField label="Tagline" value={s.hero.tagline} onChange={(v) => patch("hero", { ...s.hero, tagline: v })} />
          <TextField label="CTA Label" value={s.hero.ctaLabel} onChange={(v) => patch("hero", { ...s.hero, ctaLabel: v })} />
          <TextField label="CTA Link" value={s.hero.ctaHref} onChange={(v) => patch("hero", { ...s.hero, ctaHref: v })} />
        </Section>

        <Section title="Marquee">
          <TextField label="Marquee Text" value={s.marqueeText} onChange={(v) => patch("marqueeText", v)} full />
        </Section>

        <Section title="Hero Socials">
          <TextField label="TikTok Value" value={s.socials.tiktok.value} onChange={(v) => patch("socials", { ...s.socials, tiktok: { ...s.socials.tiktok, value: v } })} />
          <TextField label="TikTok URL" value={s.socials.tiktok.url} onChange={(v) => patch("socials", { ...s.socials, tiktok: { ...s.socials.tiktok, url: v } })} />
          <TextField label="YouTube Value" value={s.socials.youtube.value} onChange={(v) => patch("socials", { ...s.socials, youtube: { ...s.socials.youtube, value: v } })} />
          <TextField label="YouTube URL" value={s.socials.youtube.url} onChange={(v) => patch("socials", { ...s.socials, youtube: { ...s.socials.youtube, url: v } })} />
          <TextField label="Instagram Value" value={s.socials.instagram.value} onChange={(v) => patch("socials", { ...s.socials, instagram: { ...s.socials.instagram, value: v } })} />
          <TextField label="Instagram URL" value={s.socials.instagram.url} onChange={(v) => patch("socials", { ...s.socials, instagram: { ...s.socials.instagram, url: v } })} />
        </Section>

        <Section title="YouTube Live Counter">
          <NumberField label="Base" value={s.youtubeCounter.base} onChange={(v) => patch("youtubeCounter", { ...s.youtubeCounter, base: v })} />
          <NumberField label="Target (cap)" value={s.youtubeCounter.target} onChange={(v) => patch("youtubeCounter", { ...s.youtubeCounter, target: v })} />
          <NumberField label="Per Minute" value={s.youtubeCounter.perMinute} onChange={(v) => patch("youtubeCounter", { ...s.youtubeCounter, perMinute: v })} />
          <TextField label="Anchor (ISO date)" value={s.youtubeCounter.anchorIso} onChange={(v) => patch("youtubeCounter", { ...s.youtubeCounter, anchorIso: v })} />
          <TextField label="Sub Label" value={s.youtubeCounter.subLabel} onChange={(v) => patch("youtubeCounter", { ...s.youtubeCounter, subLabel: v })} full />
        </Section>

        <Section title="Stats Section (01)">
          <TextField label="Eyebrow" value={s.statsSection.eyebrow} onChange={(v) => patch("statsSection", { ...s.statsSection, eyebrow: v })} />
          <TextField label="Headline" value={s.statsSection.headline} onChange={(v) => patch("statsSection", { ...s.statsSection, headline: v })} />
          <TextAreaField label="Description" value={s.statsSection.description} onChange={(v) => patch("statsSection", { ...s.statsSection, description: v })} />
        </Section>

        <Section title="YouTube Section (02)">
          <TextField label="Eyebrow" value={s.youtubeSection.eyebrow} onChange={(v) => patch("youtubeSection", { ...s.youtubeSection, eyebrow: v })} />
          <TextField label="Headline" value={s.youtubeSection.headline} onChange={(v) => patch("youtubeSection", { ...s.youtubeSection, headline: v })} />
          <TextAreaField label="Description" value={s.youtubeSection.description} onChange={(v) => patch("youtubeSection", { ...s.youtubeSection, description: v })} />
        </Section>

        <Section title="Network Section (03)">
          <TextField label="Eyebrow" value={s.networkSection.eyebrow} onChange={(v) => patch("networkSection", { ...s.networkSection, eyebrow: v })} />
          <TextField label="Headline" value={s.networkSection.headline} onChange={(v) => patch("networkSection", { ...s.networkSection, headline: v })} />
          <TextAreaField label="Description" value={s.networkSection.description} onChange={(v) => patch("networkSection", { ...s.networkSection, description: v })} />
        </Section>

        <Section title="Demographics Section (04)">
          <TextField label="Eyebrow" value={s.demographicsSection.eyebrow} onChange={(v) => patch("demographicsSection", { ...s.demographicsSection, eyebrow: v })} />
          <TextField label="Headline" value={s.demographicsSection.headline} onChange={(v) => patch("demographicsSection", { ...s.demographicsSection, headline: v })} />
          <TextAreaField label="Age Subcopy" value={s.demographicsSection.ageSubcopy} onChange={(v) => patch("demographicsSection", { ...s.demographicsSection, ageSubcopy: v })} />
          <TextAreaField label="Gender Subcopy" value={s.demographicsSection.genderSubcopy} onChange={(v) => patch("demographicsSection", { ...s.demographicsSection, genderSubcopy: v })} />
          <TextAreaField label="Geography Subcopy" value={s.demographicsSection.geographySubcopy} onChange={(v) => patch("demographicsSection", { ...s.demographicsSection, geographySubcopy: v })} />
        </Section>

        <Section title="Engagement Metrics">
          <NumberField label="Avg Retention (%)" value={s.engagement.avgRetention} onChange={(v) => patch("engagement", { ...s.engagement, avgRetention: v })} />
          <TextField label="Likes / Video" value={s.engagement.likes} onChange={(v) => patch("engagement", { ...s.engagement, likes: v })} />
          <TextField label="Comments / Video" value={s.engagement.comments} onChange={(v) => patch("engagement", { ...s.engagement, comments: v })} />
          <TextField label="Shares / Video" value={s.engagement.shares} onChange={(v) => patch("engagement", { ...s.engagement, shares: v })} />
        </Section>

        <Section title="Partner Section (05)">
          <TextField label="Eyebrow" value={s.partnerSection.eyebrow} onChange={(v) => patch("partnerSection", { ...s.partnerSection, eyebrow: v })} />
          <TextField label="Headline" value={s.partnerSection.headline} onChange={(v) => patch("partnerSection", { ...s.partnerSection, headline: v })} />
          <TextAreaField label="Subcopy" value={s.partnerSection.subcopy} onChange={(v) => patch("partnerSection", { ...s.partnerSection, subcopy: v })} />
          <TextField label="Contact Email" value={s.partnerSection.email} onChange={(v) => patch("partnerSection", { ...s.partnerSection, email: v })} />
          <TextField label="Media Kit URL" value={s.partnerSection.mediaKitUrl} onChange={(v) => patch("partnerSection", { ...s.partnerSection, mediaKitUrl: v })} />
          <TextField label="Brands Logline" value={s.partnerSection.brandsLogline} onChange={(v) => patch("partnerSection", { ...s.partnerSection, brandsLogline: v })} full />
          <BoolField label="Show brand stats pop-up (click a logo to open campaign data)" value={s.partnerSection.showBrandModal} onChange={(v) => patch("partnerSection", { ...s.partnerSection, showBrandModal: v })} />
        </Section>

        <Section title="Careers Section">
          <TextField label="Eyebrow" value={s.careersSection.eyebrow} onChange={(v) => patch("careersSection", { ...s.careersSection, eyebrow: v })} />
          <TextField label="Headline" value={s.careersSection.headline} onChange={(v) => patch("careersSection", { ...s.careersSection, headline: v })} />
          <TextAreaField label="Body" value={s.careersSection.body} onChange={(v) => patch("careersSection", { ...s.careersSection, body: v })} />
        </Section>

        <Section title="Footer">
          <TextField label="Description" value={s.footer.description} onChange={(v) => patch("footer", { ...s.footer, description: v })} full />
          <TextField label="Copyright" value={s.footer.copyright} onChange={(v) => patch("footer", { ...s.footer, copyright: v })} />
          <TextField label="Slogan" value={s.footer.slogan} onChange={(v) => patch("footer", { ...s.footer, slogan: v })} />
        </Section>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" className={adminBtnPrimary} disabled={saving} onClick={save}>
          {saving ? "SAVING…" : "SAVE SETTINGS"}
        </button>
      </div>
    </div>
  );
}
