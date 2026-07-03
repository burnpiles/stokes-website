import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAdminSession,
  useAdminLogin,
  useAdminLogout,
  getGetAdminSessionQueryKey,
  getGetContentQueryKey,
  useUpdateSettings,
  useCreateStat, useUpdateStat, useDeleteStat,
  useCreatePlatform, useUpdatePlatform, useDeletePlatform,
  useCreateVideo, useUpdateVideo, useDeleteVideo,
  useCreateShort, useUpdateShort, useDeleteShort,
  useCreateDemographic, useUpdateDemographic, useDeleteDemographic,
  useCreateBrand, useUpdateBrand, useDeleteBrand,
  useCreatePressItem, useUpdatePressItem, useDeletePressItem,
  useCreateJob, useUpdateJob, useDeleteJob,
} from "@workspace/api-client-react";
import type { Settings } from "@workspace/api-client-react";
import { useContent } from "@/lib/content";
import { Wordmark } from "@/components/Wordmark";
import { ResourceEditor, type FieldDef } from "@/components/admin/ResourceEditor";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { adminBtnPrimary, adminBtnGhost } from "@/components/admin/AdminPrimitives";

type Draft = Record<string, unknown>;

const TABS = ["Settings", "Stats", "Platforms", "Videos", "Shorts", "Demographics", "Brands", "Press", "Jobs", "Media"] as const;
type Tab = typeof TABS[number];

function LoginScreen() {
  const queryClient = useQueryClient();
  const login = useAdminLogin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await login.mutateAsync({ data: { password } });
      if (res.authenticated) {
        await queryClient.invalidateQueries({ queryKey: getGetAdminSessionQueryKey() });
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F1EA] flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Wordmark size="lg" className="mb-6 justify-center" />
          <div className="font-mono text-[10px] tracking-[0.3em] text-[#E13B2C]">CONTENT ADMIN</div>
        </div>
        <label className="block font-mono text-[10px] tracking-[0.18em] text-[#F4F1EA]/50 uppercase mb-2">Password</label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="admin-password"
          className="w-full bg-[#141210] border border-[#F4F1EA]/15 rounded-[4px] px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E13B2C]/60 transition-colors mb-4"
        />
        {error && <div className="font-mono text-[11px] text-[#E13B2C] mb-4">{error}</div>}
        <button type="submit" disabled={login.isPending || !password} data-testid="admin-login-btn" className={`${adminBtnPrimary} w-full !py-3`}>
          {login.isPending ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const queryClient = useQueryClient();
  const content = useContent();
  const logout = useAdminLogout();
  const [tab, setTab] = useState<Tab>("Settings");

  const updateSettings = useUpdateSettings();
  const stat = { create: useCreateStat(), update: useUpdateStat(), del: useDeleteStat() };
  const platform = { create: useCreatePlatform(), update: useUpdatePlatform(), del: useDeletePlatform() };
  const video = { create: useCreateVideo(), update: useUpdateVideo(), del: useDeleteVideo() };
  const short = { create: useCreateShort(), update: useUpdateShort(), del: useDeleteShort() };
  const demo = { create: useCreateDemographic(), update: useUpdateDemographic(), del: useDeleteDemographic() };
  const brand = { create: useCreateBrand(), update: useUpdateBrand(), del: useDeleteBrand() };
  const pressItem = { create: useCreatePressItem(), update: useUpdatePressItem(), del: useDeletePressItem() };
  const job = { create: useCreateJob(), update: useUpdateJob(), del: useDeleteJob() };

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: getGetContentQueryKey() });
  }

  function wire<C, U>(r: { create: { mutateAsync: (a: { data: C }) => Promise<unknown> }; update: { mutateAsync: (a: { id: number; data: U }) => Promise<unknown> }; del: { mutateAsync: (a: { id: number }) => Promise<unknown> } }) {
    return {
      onCreate: async (data: Draft) => { await r.create.mutateAsync({ data: data as C }); await invalidate(); },
      onUpdate: async (id: number, data: Draft) => { await r.update.mutateAsync({ id, data: data as U }); await invalidate(); },
      onDelete: async (id: number) => { await r.del.mutateAsync({ id }); await invalidate(); },
    };
  }

  async function saveSettings(s: Settings) {
    await updateSettings.mutateAsync({ data: s });
    await invalidate();
  }

  async function doLogout() {
    await logout.mutateAsync();
    await queryClient.invalidateQueries({ queryKey: getGetAdminSessionQueryKey() });
  }

  const statFields: FieldDef[] = [
    { key: "label", label: "Label", type: "text" },
    { key: "value", label: "Value", type: "number" },
    { key: "suffix", label: "Suffix", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "sortOrder", label: "Sort Order", type: "number" },
  ];
  const platformFields: FieldDef[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "value", label: "Value", type: "text" },
    { key: "handle", label: "Handle", type: "text" },
    { key: "color", label: "Color (hex)", type: "text" },
    { key: "iconKey", label: "Icon (youtube/tiktok/snapchat/instagram/facebook/x)", type: "text" },
    { key: "url", label: "URL", type: "text" },
    { key: "sortOrder", label: "Sort Order", type: "number" },
    { key: "links", label: "Extra channel links (small buttons inside the card)", type: "links" },
  ];
  const videoFields: FieldDef[] = [
    { key: "title", label: "Title", type: "text" },
    { key: "tags", label: "Tags", type: "tags" },
    { key: "views", label: "Views", type: "text" },
    { key: "duration", label: "Duration", type: "text" },
    { key: "youtubeUrl", label: "YouTube Link or ID", type: "text", placeholder: "https://youtube.com/watch?v=… (thumbnail auto-pulled)" },
    { key: "featured", label: "Featured (hero)", type: "boolean" },
    { key: "sortOrder", label: "Sort Order", type: "number" },
    { key: "thumbnailUrl", label: "Thumbnail override (optional — leave empty to use YouTube's)", type: "image" },
  ];
  const shortFields: FieldDef[] = [
    { key: "title", label: "Title", type: "text" },
    { key: "views", label: "Views", type: "text" },
    { key: "youtubeUrl", label: "YouTube Link or ID", type: "text", placeholder: "https://youtube.com/shorts/… (thumbnail auto-pulled)" },
    { key: "sortOrder", label: "Sort Order", type: "number" },
    { key: "thumbnailUrl", label: "Thumbnail override (optional — leave empty to use YouTube's)", type: "image" },
  ];
  const demoFields: FieldDef[] = [
    { key: "category", label: "Category (age/gender/geography)", type: "text" },
    { key: "label", label: "Label", type: "text" },
    { key: "percent", label: "Percent", type: "number" },
    { key: "highlight", label: "Highlight", type: "boolean" },
    { key: "sortOrder", label: "Sort Order", type: "number" },
  ];
  const brandFields: FieldDef[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "campaign", label: "Campaign", type: "text" },
    { key: "formats", label: "Formats", type: "text" },
    { key: "quote", label: "Quote", type: "textarea" },
    { key: "sortOrder", label: "Sort Order", type: "number" },
    { key: "logoUrl", label: "Logo", type: "image" },
    { key: "stats", label: "Stats", type: "brandstats" },
  ];
  const pressFields: FieldDef[] = [
    { key: "outlet", label: "Outlet", type: "text", placeholder: "e.g. Forbes" },
    { key: "title", label: "Headline", type: "text" },
    { key: "url", label: "Article URL", type: "text", placeholder: "https://…" },
    { key: "sortOrder", label: "Sort Order", type: "number" },
    { key: "imageUrl", label: "Image", type: "image" },
  ];
  const jobFields: FieldDef[] = [
    { key: "title", label: "Title", type: "text" },
    { key: "brand", label: "Card tag (shown on the job card — leave blank for \"Stokes Twins\")", type: "text", placeholder: "e.g. Stokes Twins / Kat" },
    { key: "department", label: "Department", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "type", label: "Type", type: "multiselect", options: ["On-site", "Hybrid", "Remote", "Full-time", "Part-time", "Contract"] },
    { key: "applyUrl", label: "Apply URL", type: "text" },
    { key: "active", label: "Active", type: "boolean" },
    { key: "sortOrder", label: "Sort Order", type: "number" },
  ];

  const nextSort = (arr: Array<{ sortOrder?: number }>) => (arr.length ? Math.max(...arr.map((x) => x.sortOrder ?? 0)) + 1 : 1);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F1EA]">
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#F4F1EA]/10">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Wordmark size="sm" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#E13B2C]">ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/stokes-twins/" target="_blank" rel="noopener noreferrer" className={adminBtnGhost}>VIEW SITE ↗</a>
            <button type="button" className={adminBtnGhost} onClick={doLogout}>LOG OUT</button>
          </div>
        </div>
        <nav className="max-w-[1100px] mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              data-testid={`admin-tab-${t.toLowerCase()}`}
              className={`font-mono text-[11px] tracking-[0.12em] px-4 py-3 -mb-px border-b-2 whitespace-nowrap transition-colors ${tab === t ? "border-[#E13B2C] text-[#F4F1EA]" : "border-transparent text-[#F4F1EA]/40 hover:text-[#F4F1EA]"}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-10">
        {tab === "Settings" && <SettingsEditor settings={content.settings} onSave={saveSettings} />}
        {tab === "Stats" && (
          <ResourceEditor title="Stats" description="The big numbers band." items={content.stats} fields={statFields} titleKey="label"
            newDraft={() => ({ label: "", value: 0, suffix: "", description: "", sortOrder: nextSort(content.stats) })} {...wire(stat)} />
        )}
        {tab === "Platforms" && (
          <ResourceEditor title="Platforms" description="The network grid." items={content.platforms} fields={platformFields} titleKey="name"
            newDraft={() => ({ name: "", value: "", handle: "", color: "#F4F1EA", iconKey: "youtube", url: "", links: [], sortOrder: nextSort(content.platforms) })} {...wire(platform)} />
        )}
        {tab === "Videos" && (
          <ResourceEditor title="Videos" description="One hero (the big featured video) + up to 3 full-length videos in the grid. Toggle Featured to set the hero — only one video can be the hero." items={content.videos} fields={videoFields} titleKey="title" maxItems={4}
            newDraft={() => ({ title: "", tags: [], views: "", duration: "", youtubeUrl: "", thumbnailUrl: "", featured: false, sortOrder: nextSort(content.videos) })} {...wire(video)} />
        )}
        {tab === "Shorts" && (
          <ResourceEditor title="Shorts" description="The shorts carousel — up to 10." items={content.shorts} fields={shortFields} titleKey="title" maxItems={10}
            newDraft={() => ({ title: "", views: "", youtubeUrl: "", thumbnailUrl: "", sortOrder: nextSort(content.shorts) })} {...wire(short)} />
        )}
        {tab === "Demographics" && (
          <ResourceEditor title="Demographics" description="Age, gender, geography bars. Category must be age, gender, or geography." items={content.demographics} fields={demoFields} titleKey="label"
            newDraft={() => ({ category: "age", label: "", percent: 0, highlight: false, sortOrder: nextSort(content.demographics) })} {...wire(demo)} />
        )}
        {tab === "Brands" && (
          <ResourceEditor title="Brands" description="Partner logos and campaign results." items={content.brands} fields={brandFields} titleKey="name"
            newDraft={() => ({ name: "", logoUrl: "", campaign: "", formats: "", quote: "", stats: [], sortOrder: nextSort(content.brands) })} {...wire(brand)} />
        )}
        {tab === "Press" && (
          <ResourceEditor title="Press" description="Press features and articles shown in the In The Press section." items={content.press} fields={pressFields} titleKey="title"
            newDraft={() => ({ outlet: "", title: "", url: "", imageUrl: "", sortOrder: nextSort(content.press) })} {...wire(pressItem)} />
        )}
        {tab === "Jobs" && (
          <ResourceEditor title="Jobs" description="Open roles on the careers page." items={content.jobs} fields={jobFields} titleKey="title" sortable
            newDraft={() => ({ title: "", brand: "", department: "", location: "", type: "", applyUrl: "#", active: true, sortOrder: nextSort(content.jobs) })} {...wire(job)} />
        )}
        {tab === "Media" && <MediaLibrary />}
      </main>
    </div>
  );
}

export default function AdminPage() {
  const { data, isLoading } = useGetAdminSession();

  useEffect(() => {
    document.title = "Admin | Stokes Twins";
    document.body.style.backgroundColor = "#0A0A0A";
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="font-mono text-xs tracking-widest text-[#F4F1EA]/40 animate-pulse">LOADING…</div>
      </div>
    );
  }

  if (!data?.authenticated) return <LoginScreen />;
  return <Dashboard />;
}
