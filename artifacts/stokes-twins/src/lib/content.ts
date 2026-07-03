import { useMemo } from "react";
import { useGetContent } from "@workspace/api-client-react";
import type { Content, Settings } from "@workspace/api-client-react";

export const defaultSettings: Settings = {
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
  pressSection: {
    eyebrow: "06 — IN THE PRESS",
    headline: "Making headlines.",
  },
  careersSection: {
    eyebrow: "CAREERS · PRESS PLAY WITH US",
    headline: "Join the production.",
    body: "We're building the team behind the numbers — editors, producers, strategists, and story minds who move at the speed of the feed. Pick a role, hit apply, and tell us why you live loud.",
  },
  footer: {
    description: "CREATOR-LED FAMILY ENTERTAINMENT STUDIO",
    copyright: "© 2026 Stokes Empire LLC",
    slogan: "PRESS PLAY · LIVE LOUD · NEVER PAUSE",
  },
  sectionVisibility: {
    numbers: true,
    youtube: true,
    channels: true,
    demographics: true,
    partner: true,
    careers: true,
    press: true,
  },
};

export const defaultContent: Content = {
  settings: defaultSettings,
  stats: [
    { id: 1, label: "SOCIAL FOLLOWERS*", value: 250, suffix: "M+", description: "Across every platform", sortOrder: 1 },
    { id: 2, label: "HOURS WATCHED*", value: 0, suffix: "Billions", description: "Total watch time across platforms", sortOrder: 2 },
    { id: 3, label: "VIEWS*", value: 0, suffix: "Tens of billions", description: "Across all channels", sortOrder: 3 },
  ],
  platforms: [
    { id: 1, name: "YouTube", value: "141M", handle: "@stokestwins", color: "#FF0000", iconKey: "youtube", url: "https://www.youtube.com/@stokestwins", links: [
      { label: "Top Videos", value: "3.4M", url: "https://www.youtube.com/@stokestwinstopvideos" },
      { label: "2nd Channel", value: "13.1M", url: "https://www.youtube.com/channel/UCUdKQXtKb1me2Gt1nz6tzdg" },
    ], sortOrder: 1 },
    { id: 2, name: "TikTok", value: "30.8M", handle: "@stokestwins", color: "#F4F1EA", iconKey: "tiktok", url: "https://www.tiktok.com/@stokestwins?lang=en", links: [], sortOrder: 2 },
    { id: 4, name: "Instagram", value: "4.9M", handle: "@stokestwins", color: "#E1306C", iconKey: "instagram", url: "https://www.instagram.com/stokestwins/?hl=en", links: [
      { label: "@alexstokes", value: "3.6M", url: "https://www.instagram.com/alexstokes/" },
    ], sortOrder: 3 },
  ],
  videos: [
    { id: 1, title: "I Built 4 SECRET Rooms In ONE COLOR!", tags: [], views: "", duration: "", youtubeUrl: "https://www.youtube.com/watch?v=RqKDKaHPPlQ", thumbnailUrl: "", featured: true, sortOrder: 0 },
    { id: 2, title: "I Survived The World's STRICTEST School!", tags: [], views: "", duration: "", youtubeUrl: "https://www.youtube.com/watch?v=LnVfvz_CJ1o", thumbnailUrl: "", featured: false, sortOrder: 1 },
    { id: 3, title: "I Built 3 SECRET Rooms In School!", tags: [], views: "", duration: "", youtubeUrl: "https://www.youtube.com/watch?v=wSxZzlKl0-U", thumbnailUrl: "", featured: false, sortOrder: 2 },
    { id: 4, title: "I Spent 24 Hours With The World’s SMALLEST Woman!", tags: [], views: "", duration: "", youtubeUrl: "https://www.youtube.com/watch?v=TzebVGUMrGU", thumbnailUrl: "", featured: false, sortOrder: 3 },
  ],
  shorts: [
    { id: 1, title: "My WORST Birthday Ever..", views: "", youtubeUrl: "https://www.youtube.com/shorts/jO1P7y3eEcU", thumbnailUrl: "", sortOrder: 1 },
    { id: 2, title: "World’s Most DANGEROUS Theme Park!", views: "", youtubeUrl: "https://www.youtube.com/shorts/P9jqFr3TvSE", thumbnailUrl: "", sortOrder: 2 },
    { id: 3, title: "WORLD'S SHORTEST WOMAN", views: "", youtubeUrl: "https://www.youtube.com/shorts/SV3b20W0sS0", thumbnailUrl: "", sortOrder: 3 },
    { id: 4, title: "Walking On Water Prank!", views: "", youtubeUrl: "https://www.youtube.com/shorts/MhxtHVk2dqc", thumbnailUrl: "", sortOrder: 4 },
    { id: 5, title: "Who Will Win The World Cup?", views: "", youtubeUrl: "https://www.youtube.com/shorts/8X5IDuPm8Pw", thumbnailUrl: "", sortOrder: 5 },
    { id: 6, title: "World’s Strongest Man vs Unliftable Dumbbell!", views: "", youtubeUrl: "https://www.youtube.com/shorts/cCWmiNhbii0", thumbnailUrl: "", sortOrder: 6 },
    { id: 7, title: "Don’t Hit The Wrong Rumi..", views: "", youtubeUrl: "https://www.youtube.com/shorts/XQO2ObC9IEc", thumbnailUrl: "", sortOrder: 7 },
    { id: 8, title: "This Is The End.. @markwahlberg", views: "", youtubeUrl: "https://www.youtube.com/shorts/D8xBPn3TT84", thumbnailUrl: "", sortOrder: 8 },
    { id: 9, title: "I Can’t Believe This Worked..", views: "", youtubeUrl: "https://www.youtube.com/shorts/Juvg3nwVgK8", thumbnailUrl: "", sortOrder: 9 },
    { id: 10, title: "How Much Food Can You Sneak Into The Movies?", views: "", youtubeUrl: "https://www.youtube.com/shorts/UESe5zBsuIA", thumbnailUrl: "", sortOrder: 10 },
  ],
  demographics: [
    { id: 1, category: "age", label: "13–17", percent: 22, highlight: false, sortOrder: 1 },
    { id: 2, category: "age", label: "18–24", percent: 31, highlight: true, sortOrder: 2 },
    { id: 3, category: "age", label: "25–34", percent: 27, highlight: false, sortOrder: 3 },
    { id: 4, category: "age", label: "35–44", percent: 13, highlight: false, sortOrder: 4 },
    { id: 5, category: "age", label: "45+", percent: 7, highlight: false, sortOrder: 5 },
    { id: 6, category: "gender", label: "Male", percent: 58, highlight: false, sortOrder: 1 },
    { id: 7, category: "gender", label: "Female", percent: 40, highlight: false, sortOrder: 2 },
    { id: 8, category: "gender", label: "Other / Undisclosed", percent: 2, highlight: false, sortOrder: 3 },
    { id: 9, category: "geography", label: "United States", percent: 38, highlight: false, sortOrder: 1 },
    { id: 10, category: "geography", label: "United Kingdom", percent: 9, highlight: false, sortOrder: 2 },
    { id: 11, category: "geography", label: "Brazil", percent: 7, highlight: false, sortOrder: 3 },
    { id: 12, category: "geography", label: "India", percent: 6, highlight: false, sortOrder: 4 },
    { id: 13, category: "geography", label: "Canada", percent: 5, highlight: false, sortOrder: 5 },
    { id: 14, category: "geography", label: "Rest of World", percent: 35, highlight: false, sortOrder: 6 },
  ],
  brands: [
    {
      id: 1, name: "Adobe", logoUrl: "seed/adobe.png", campaign: '"Create Bold" Integration',
      formats: "Pre-roll + Product Integration + Custom Short",
      quote: "Integrated natively into a challenge format that the audience already loves — zero ad-fatigue, full brand recall.",
      stats: [
        { label: "Impressions", value: "142M+" }, { label: "Views", value: "88M+" }, { label: "Engagement", value: "4.8%" },
        { label: "Awareness", value: "+23%" }, { label: "CTR", value: "3.1%" }, { label: "Retention", value: "71%" },
      ],
      sortOrder: 1,
    },
    {
      id: 2, name: "Buldak", logoUrl: "seed/buldak.png", campaign: "Buldak Challenge Activation",
      formats: "Challenge + Product Feature + Shorts Series",
      quote: "A challenge format purpose-built for the product — the audience became the campaign, and it went everywhere.",
      stats: [
        { label: "Impressions", value: "98M+" }, { label: "Views", value: "72M+" }, { label: "Engagement", value: "7.4%" },
        { label: "Purchase Intent", value: "+41%" }, { label: "UGC", value: "12K+" }, { label: "Retention", value: "68%" },
      ],
      sortOrder: 2,
    },
    {
      id: 3, name: "Netflix", logoUrl: "seed/netflix.png", campaign: "Series Launch Integration",
      formats: "Dedicated Video + Shorts Series + Cross-Platform Reels",
      quote: "The Stokes network put the show in front of exactly the right demo — at scale, in a format they actually watch.",
      stats: [
        { label: "Impressions", value: "215M+" }, { label: "Views", value: "134M+" }, { label: "Engagement", value: "6.1%" },
        { label: "Awareness", value: "+31%" }, { label: "Tune-In Intent", value: "+28%" }, { label: "Retention", value: "74%" },
      ],
      sortOrder: 3,
    },
    {
      id: 4, name: "#TeamWater", logoUrl: "seed/teamwater.png", campaign: '"Stay Hydrated" Mission Integration',
      formats: "Mission Video + Behind-the-Scenes + Instagram Reels",
      quote: "The mission matched the audience's values — authentic integration that felt like content, not an ad.",
      stats: [
        { label: "Impressions", value: "67M+" }, { label: "Views", value: "51M+" }, { label: "Engagement", value: "5.2%" },
        { label: "Recall", value: "+28%" }, { label: "Sign-Ups", value: "84K+" }, { label: "Retention", value: "69%" },
      ],
      sortOrder: 4,
    },
  ],
  press: [
    { id: 1, outlet: "Forbes", title: "Forbes Top Creators 2026", url: "https://www.forbes.com/sites/stevenbertoni/2026/06/23/forbes-top-creators-2026/", imageUrl: "press/forbes-2026.png", sortOrder: 1 },
    { id: 2, outlet: "The Hollywood Reporter", title: "Stokes Twins Sign With CAA", url: "https://www.hollywoodreporter.com/business/digital/stokes-twins-sign-caa-1236454079/", imageUrl: "press/thr-caa.png", sortOrder: 2 },
    { id: 3, outlet: "Forbes", title: "Forbes Top Creators 2025", url: "https://www.forbes.com/sites/stevenbertoni/2025/06/16/forbes-top-creators-2025/", imageUrl: "press/forbes-2025.png", sortOrder: 3 },
    { id: 4, outlet: "Schön! Magazine", title: "Interview: The Stokes Twins", url: "https://schonmagazine.com/interview-the-stokes-twins/", imageUrl: "press/schon.png", sortOrder: 4 },
  ],
  jobs: [
    { id: 1, title: "Head of Production", brand: null, department: "Leadership", location: "LA", type: "On-site · Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdrF5SvcnQfYTF5TxVGS-X5ufcMCevAoo5BC7TrLL16TSLXfg/viewform?usp=dialog", active: true, sortOrder: 1 },
    { id: 2, title: "Head of Creative", brand: null, department: "Leadership", location: "LA", type: "On-site · Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfrV2Rwi57dMyKpWZ6bz0prguf9lJJInblRovFrd-BoPiQddg/viewform?usp=dialog", active: true, sortOrder: 2 },
    { id: 3, title: "Producer", brand: null, department: "Production", location: "LA", type: "On-site · Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeGPAF7X3b7yoSt2_LHZy2kWUjI4R4Ks0g4TwFlrPFKIQqixw/viewform", active: true, sortOrder: 3 },
    { id: 4, title: "Story Editor", brand: null, department: "Editorial", location: "LA", type: "Hybrid · Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf2AidLoQixrB7RZJGT0CyFC9Pv5mEDG1h0uCE8srAOMvHrLg/viewform?usp=header", active: true, sortOrder: 4 },
    { id: 5, title: "Shorts Strategist", brand: null, department: "Strategy", location: "Remote (US)", type: "Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSePFMpwqPGwwv3KdPDgaBve2MjLls0BnUvF7rNzOePCoykh0w/viewform?usp=header", active: true, sortOrder: 5 },
    { id: 6, title: "Compilation Content Strategist", brand: null, department: "Strategy", location: "Remote (US)", type: "Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLScslAGHUagIhJQX3TeU6br6pTufqDI3gcIHL_dPLFx9J_f62A/viewform?usp=publish-editor", active: true, sortOrder: 6 },
    { id: 7, title: "Shorts Editor", brand: null, department: "Post-Production", location: "Remote (US)", type: "Full-time", applyUrl: "https://forms.gle/pj2jrsjbVEBgS7cd9", active: true, sortOrder: 7 },
    { id: 8, title: "Assistant Editor", brand: null, department: "Post-Production", location: "Remote (US)", type: "Contract", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfW5xtcx3t8JwFeLgO_xnz5ugddMLHntwqM3so7Q-8wqdeOTQ/viewform?usp=dialog", active: true, sortOrder: 8 },
    { id: 9, title: "Video Editor", brand: "Stokes Twins / Kat", department: "Post-Production", location: "Remote (US)", type: "Full-time", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLScY649WaT44WfOmFpj52jv-nPTTTDSov-N0t97ldKglCOW77A/viewform?usp=dialog", active: true, sortOrder: 9 },
    { id: 10, title: "Assistant Editor", brand: "Stokes Twins / Kat", department: "Post-Production", location: "Remote (US)", type: "Contract", applyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf6UAZwon0zjg5ALaWhUvvQmpOIQguQMGPO6TGnHmnB1ujHkA/viewform?usp=dialog", active: true, sortOrder: 10 },
  ],
};

function pick<T>(arr: T[] | undefined | null, fallback: T[]): T[] {
  return arr && arr.length > 0 ? arr : fallback;
}

export function mergeContent(data: Content | undefined): Content {
  if (!data) return defaultContent;
  return {
    settings: data.settings
      ? {
          ...data.settings,
          pressSection: data.settings.pressSection ?? defaultSettings.pressSection,
          sectionVisibility: {
            ...defaultSettings.sectionVisibility!,
            ...data.settings.sectionVisibility,
          },
        }
      : defaultContent.settings,
    stats: pick(data.stats, defaultContent.stats),
    platforms: pick(data.platforms, defaultContent.platforms),
    videos: pick(data.videos, defaultContent.videos),
    shorts: pick(data.shorts, defaultContent.shorts),
    demographics: pick(data.demographics, defaultContent.demographics),
    brands: pick(data.brands, defaultContent.brands),
    press: pick(data.press, defaultContent.press),
    jobs: pick(data.jobs, defaultContent.jobs),
  };
}

export function useContent(): Content {
  const { data } = useGetContent();
  return useMemo(() => mergeContent(data), [data]);
}
