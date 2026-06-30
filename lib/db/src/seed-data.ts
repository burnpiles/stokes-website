import type { SiteSettings } from "./schema/settings";
import type { InsertStat } from "./schema/stats";
import type { InsertPlatform } from "./schema/platforms";
import type { InsertVideo } from "./schema/videos";
import type { InsertShort } from "./schema/shorts";
import type { InsertDemographic } from "./schema/demographics";
import type { InsertBrand } from "./schema/brands";
import type { InsertJob } from "./schema/jobs";

export const defaultSettings: SiteSettings = {
  hero: {
    eyebrow: "CREATOR-LED FAMILY ENTERTAINMENT STUDIO",
    tagline:
      "The largest creator-led family entertainment studio — 250 million followers, a transmedia slate, and a global tentpole event every single month.",
    ctaLabel: "PARTNER WITH US →",
    ctaHref: "#partner",
  },
  marqueeText: "ANIMATION · ANIME · BRANDED · CONSUMER PRODUCTS · FILMS · GAMES · TECHNOLOGY",
  socials: {
    tiktok: { value: "30.8M", url: "https://www.tiktok.com/@stokestwins?lang=en" },
    youtube: { value: "141M", url: "https://www.youtube.com/@stokestwins" },
    instagram: { value: "4.9M", url: "https://www.instagram.com/stokestwins/?hl=en" },
  },
  youtubeCounter: {
    base: 141000000,
    target: 150000000,
    perMinute: 100,
    anchorIso: "2026-06-30T00:00:00Z",
    subLabel: "Subscribers and counting",
  },
  statsSection: {
    eyebrow: "01 — THE NUMBERS",
    headline: "An audience that doesn't scroll past.",
    description:
      "Alan and Alex Stokes turn stories into global franchises — a transmedia studio spanning blockbuster YouTube formats, unscripted, scripted, animation, and live, operating at the scale of a tentpole event every month.",
  },
  youtubeSection: {
    eyebrow: "02 — THE ENGINE",
    headline: "YouTube is the Engine.",
    description: "",
  },
  networkSection: {
    eyebrow: "03 — THE NETWORK",
    headline: "Global audience, multiple platforms.",
    description:
      "A native presence on every platform that matters — a connected network that moves as one.",
  },
  demographicsSection: {
    eyebrow: "04 — WHO'S WATCHING",
    headline: "Gen-Z and young millennials, leaning all the way in.",
    ageSubcopy:
      "More than half the audience is under 25 — the demographic brands fight hardest to reach.",
    genderSubcopy:
      "A balanced, family-first audience — co-viewing across parents and kids drives a broad, brand-safe reach.",
    geographySubcopy:
      "A truly global footprint — anchored in the US, with strength across 190+ markets.",
  },
  engagement: {
    avgRetention: 71,
    likes: "2.4M",
    comments: "84K",
    shares: "1.1M",
  },
  partnerSection: {
    eyebrow: "05 — PRESS PLAY WITH US",
    headline: "Put Your Brand In Play",
    subcopy:
      "Custom integrations, title sponsorships, and cross-platform campaigns designed for the world's largest family audience.",
    email: "partnerships@stokestwins.com",
    mediaKitUrl: "#",
    brandsLogline: "TRUSTED BY BRANDS THAT GO BIG",
    showBrandModal: false,
  },
  careersSection: {
    eyebrow: "CAREERS · PRESS PLAY WITH US",
    headline: "Join the production.",
    body: "We're building the team behind the numbers — editors, producers, strategists, and story minds who move at the speed of the feed. Pick a role, hit apply, and tell us why you live loud.",
  },
  footer: {
    description: "CREATOR-LED FAMILY ENTERTAINMENT STUDIO",
    copyright: "© 2026 STOKES TWINS LLC",
    slogan: "PRESS PLAY · LIVE LOUD · NEVER PAUSE",
  },
};

export const seedStats: InsertStat[] = [
  { label: "FOLLOWERS", value: 250, suffix: "M+", description: "Across every platform", sortOrder: 1 },
  { label: "MONTHLY VIEWS", value: 1.2, suffix: "B", description: "Every 30 days, and climbing", sortOrder: 2 },
  { label: "LIFETIME VIEWS", value: 62, suffix: "B", description: "Since the first upload", sortOrder: 3 },
];

export const seedPlatforms: InsertPlatform[] = [
  { name: "YouTube", value: "141M", handle: "9 channels", color: "#FF0000", iconKey: "youtube", url: "https://www.youtube.com/@stokestwins", sortOrder: 1 },
  { name: "TikTok", value: "30.8M", handle: "@stokestwins", color: "#F4F1EA", iconKey: "tiktok", url: "https://www.tiktok.com/@stokestwins?lang=en", sortOrder: 2 },
  { name: "Instagram", value: "4.9M", handle: "@stokestwins", color: "#E1306C", iconKey: "instagram", url: "https://www.instagram.com/stokestwins/?hl=en", sortOrder: 3 },
];

export const seedVideos: InsertVideo[] = [
  { title: "I Built 4 SECRET Rooms In ONE COLOR!", tags: [], views: "", duration: "", youtubeUrl: "https://www.youtube.com/watch?v=RqKDKaHPPlQ", thumbnailUrl: "", featured: true, sortOrder: 0 },
  { title: "I Survived The World's STRICTEST School!", tags: [], views: "", duration: "", youtubeUrl: "https://www.youtube.com/watch?v=LnVfvz_CJ1o", thumbnailUrl: "", featured: false, sortOrder: 1 },
  { title: "I Built 3 SECRET Rooms In School!", tags: [], views: "", duration: "", youtubeUrl: "https://www.youtube.com/watch?v=wSxZzlKl0-U", thumbnailUrl: "", featured: false, sortOrder: 2 },
  { title: "I Spent 24 Hours With The World’s SMALLEST Woman!", tags: [], views: "", duration: "", youtubeUrl: "https://www.youtube.com/watch?v=TzebVGUMrGU", thumbnailUrl: "", featured: false, sortOrder: 3 },
];

export const seedShorts: InsertShort[] = [
  { title: "My WORST Birthday Ever..", views: "", youtubeUrl: "https://www.youtube.com/shorts/jO1P7y3eEcU", thumbnailUrl: "", sortOrder: 1 },
  { title: "World’s Most DANGEROUS Theme Park!", views: "", youtubeUrl: "https://www.youtube.com/shorts/P9jqFr3TvSE", thumbnailUrl: "", sortOrder: 2 },
  { title: "WORLD'S SHORTEST WOMAN", views: "", youtubeUrl: "https://www.youtube.com/shorts/SV3b20W0sS0", thumbnailUrl: "", sortOrder: 3 },
  { title: "Walking On Water Prank!", views: "", youtubeUrl: "https://www.youtube.com/shorts/MhxtHVk2dqc", thumbnailUrl: "", sortOrder: 4 },
  { title: "Who Will Win The World Cup?", views: "", youtubeUrl: "https://www.youtube.com/shorts/8X5IDuPm8Pw", thumbnailUrl: "", sortOrder: 5 },
];

export const seedDemographics: InsertDemographic[] = [
  { category: "age", label: "13–17", percent: 22, highlight: false, sortOrder: 1 },
  { category: "age", label: "18–24", percent: 31, highlight: true, sortOrder: 2 },
  { category: "age", label: "25–34", percent: 27, highlight: false, sortOrder: 3 },
  { category: "age", label: "35–44", percent: 13, highlight: false, sortOrder: 4 },
  { category: "age", label: "45+", percent: 7, highlight: false, sortOrder: 5 },
  { category: "gender", label: "Male", percent: 58, highlight: false, sortOrder: 1 },
  { category: "gender", label: "Female", percent: 40, highlight: false, sortOrder: 2 },
  { category: "gender", label: "Other / Undisclosed", percent: 2, highlight: false, sortOrder: 3 },
  { category: "geography", label: "United States", percent: 38, highlight: false, sortOrder: 1 },
  { category: "geography", label: "United Kingdom", percent: 9, highlight: false, sortOrder: 2 },
  { category: "geography", label: "Brazil", percent: 7, highlight: false, sortOrder: 3 },
  { category: "geography", label: "India", percent: 6, highlight: false, sortOrder: 4 },
  { category: "geography", label: "Canada", percent: 5, highlight: false, sortOrder: 5 },
  { category: "geography", label: "Rest of World", percent: 35, highlight: false, sortOrder: 6 },
];

export const seedBrands: InsertBrand[] = [
  {
    name: "Adobe",
    logoUrl: "seed/adobe.png",
    campaign: '"Create Bold" Integration',
    formats: "Pre-roll + Product Integration + Custom Short",
    quote:
      "Integrated natively into a challenge format that the audience already loves — zero ad-fatigue, full brand recall.",
    stats: [
      { label: "Impressions", value: "142M+" },
      { label: "Views", value: "88M+" },
      { label: "Engagement", value: "4.8%" },
      { label: "Awareness", value: "+23%" },
      { label: "CTR", value: "3.1%" },
      { label: "Retention", value: "71%" },
    ],
    sortOrder: 1,
  },
  {
    name: "Amazon",
    logoUrl: "seed/amazon.png",
    campaign: "",
    formats: "",
    quote: "",
    stats: [],
    sortOrder: 2,
  },
  {
    name: "Buldak",
    logoUrl: "seed/buldak.png",
    campaign: "Buldak Challenge Activation",
    formats: "Challenge + Product Feature + Shorts Series",
    quote:
      "A challenge format purpose-built for the product — the audience became the campaign, and it went everywhere.",
    stats: [
      { label: "Impressions", value: "98M+" },
      { label: "Views", value: "72M+" },
      { label: "Engagement", value: "7.4%" },
      { label: "Purchase Intent", value: "+41%" },
      { label: "UGC", value: "12K+" },
      { label: "Retention", value: "68%" },
    ],
    sortOrder: 3,
  },
  {
    name: "Disney",
    logoUrl: "seed/disney.png",
    campaign: "",
    formats: "",
    quote: "",
    stats: [],
    sortOrder: 4,
  },
  {
    name: "Netflix",
    logoUrl: "seed/netflix.png",
    campaign: "Series Launch Integration",
    formats: "Dedicated Video + Shorts Series + Cross-Platform Reels",
    quote:
      "The Stokes network put the show in front of exactly the right demo — at scale, in a format they actually watch.",
    stats: [
      { label: "Impressions", value: "215M+" },
      { label: "Views", value: "134M+" },
      { label: "Engagement", value: "6.1%" },
      { label: "Awareness", value: "+31%" },
      { label: "Tune-In Intent", value: "+28%" },
      { label: "Retention", value: "74%" },
    ],
    sortOrder: 5,
  },
  {
    name: "Paramount",
    logoUrl: "seed/paramount.png",
    campaign: "",
    formats: "",
    quote: "",
    stats: [],
    sortOrder: 6,
  },
  {
    name: "SixFlags",
    logoUrl: "seed/sixflags.png",
    campaign: "",
    formats: "",
    quote: "",
    stats: [],
    sortOrder: 7,
  },
  {
    name: "#TeamWater",
    logoUrl: "seed/teamwater.png",
    campaign: '"Stay Hydrated" Mission Integration',
    formats: "Mission Video + Behind-the-Scenes + Instagram Reels",
    quote:
      "The mission matched the audience's values — authentic integration that felt like content, not an ad.",
    stats: [
      { label: "Impressions", value: "67M+" },
      { label: "Views", value: "51M+" },
      { label: "Engagement", value: "5.2%" },
      { label: "Recall", value: "+28%" },
      { label: "Sign-Ups", value: "84K+" },
      { label: "Retention", value: "69%" },
    ],
    sortOrder: 8,
  },
];

export const seedJobs: InsertJob[] = [
  { title: "Head of Production", brand: null, department: "Leadership", location: "LA", type: "On-site · Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdrF5SvcnQfYTF5TxVGS-X5ufcMCevAoo5BC7TrLL16TSLXfg/viewform?usp=dialog", active: true, sortOrder: 1 },
  { title: "Head of Creative", brand: null, department: "Leadership", location: "LA", type: "On-site · Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfrV2Rwi57dMyKpWZ6bz0prguf9lJJInblRovFrd-BoPiQddg/viewform?usp=dialog", active: true, sortOrder: 2 },
  { title: "Producer", brand: null, department: "Production", location: "LA", type: "On-site · Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeGPAF7X3b7yoSt2_LHZy2kWUjI4R4Ks0g4TwFlrPFKIQqixw/viewform", active: true, sortOrder: 3 },
  { title: "Story Editor", brand: null, department: "Editorial", location: "LA", type: "Hybrid · Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf2AidLoQixrB7RZJGT0CyFC9Pv5mEDG1h0uCE8srAOMvHrLg/viewform?usp=header", active: true, sortOrder: 4 },
  { title: "Shorts Strategist", brand: null, department: "Strategy", location: "Remote (US)", type: "Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSePFMpwqPGwwv3KdPDgaBve2MjLls0BnUvF7rNzOePCoykh0w/viewform?usp=header", active: true, sortOrder: 5 },
  { title: "Compilation Content Strategist", brand: null, department: "Strategy", location: "Remote (US)", type: "Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLScslAGHUagIhJQX3TeU6br6pTufqDI3gcIHL_dPLFx9J_f62A/viewform?usp=publish-editor", active: true, sortOrder: 6 },
  { title: "Shorts Editor", brand: null, department: "Post-Production", location: "Remote (US)", type: "Full-time", applyUrl: "https://forms.gle/pj2jrsjbVEBgS7cd9", active: true, sortOrder: 7 },
  { title: "Assistant Editor", brand: null, department: "Post-Production", location: "Remote (US)", type: "Contract", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfW5xtcx3t8JwFeLgO_xnz5ugddMLHntwqM3so7Q-8wqdeOTQ/viewform?usp=dialog", active: true, sortOrder: 8 },
  { title: "Video Editor", brand: "Stokes Twins / Kat", department: "Post-Production", location: "Remote (US)", type: "Full-time", applyUrl: "#", active: true, sortOrder: 9 },
  { title: "Assistant Editor", brand: "Stokes Twins / Kat", department: "Post-Production", location: "Remote (US)", type: "Contract", applyUrl: "#", active: true, sortOrder: 10 },
];
