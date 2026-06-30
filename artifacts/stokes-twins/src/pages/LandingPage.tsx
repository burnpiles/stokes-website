import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Wordmark } from "@/components/Wordmark";
import { useCountUp } from "@/hooks/useCountUp";
import { useReveal } from "@/hooks/useReveal";
import { useBarGrow } from "@/hooks/useBarGrow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import adobeLogo from "@assets/adobe-final_1782849545963.png";
import buldakLogo from "@assets/buldak-final_1782849545963.png";
import netflixLogo from "@assets/netflix-final_1782849545963.png";
import teamwaterLogo from "@assets/teamwater-final_1782849545963.png";

import gamingImg from "@/assets/gaming-cat.png";
import outdoorImg from "@/assets/outdoor-cat.png";
import mysteryImg from "@/assets/mystery-cat.png";
import trophyImg from "@/assets/trophy-cat.png";
import workDouble from "@/assets/work-double.png";
import workCircle from "@/assets/work-circle.png";
import workHide from "@/assets/work-hide.png";
import workBeat from "@/assets/work-beat.png";
import workTrophy from "@/assets/work-trophy.png";

type BrandStat = { label: string; value: string };
type Brand = {
  name: string;
  logo: string;
  campaign: string;
  formats: string;
  stats: BrandStat[];
  quote: string;
};

const BRANDS: Brand[] = [
  {
    name: "Adobe",
    logo: adobeLogo,
    campaign: '"Create Bold" Integration',
    formats: "Pre-roll + Product Integration + Custom Short",
    stats: [
      { label: "Total Impressions", value: "142M+" },
      { label: "Views Delivered", value: "88M+" },
      { label: "Avg. Engagement Rate", value: "4.8%" },
      { label: "Brand Awareness Lift", value: "+23%" },
      { label: "Click-Through Rate", value: "3.1%" },
      { label: "Audience Retention", value: "71%" },
    ],
    quote: "Integrated natively into a challenge format that the audience already loves — zero ad-fatigue, full brand recall.",
  },
  {
    name: "Buldak",
    logo: buldakLogo,
    campaign: "Buldak Challenge Activation",
    formats: "Challenge + Product Feature + Shorts Series",
    stats: [
      { label: "Total Impressions", value: "98M+" },
      { label: "Views Delivered", value: "72M+" },
      { label: "Avg. Engagement Rate", value: "7.4%" },
      { label: "Purchase Intent Lift", value: "+41%" },
      { label: "UGC Response Videos", value: "12K+" },
      { label: "Audience Retention", value: "68%" },
    ],
    quote: "A challenge format purpose-built for the product — the audience became the campaign, and it went everywhere.",
  },
  {
    name: "Netflix",
    logo: netflixLogo,
    campaign: "Series Launch Integration",
    formats: "Dedicated Video + Shorts Series + Cross-Platform Reels",
    stats: [
      { label: "Total Impressions", value: "215M+" },
      { label: "Views Delivered", value: "134M+" },
      { label: "Avg. Engagement Rate", value: "6.1%" },
      { label: "Show Awareness Lift", value: "+31%" },
      { label: "Tune-In Intent", value: "+28%" },
      { label: "Audience Retention", value: "74%" },
    ],
    quote: "The Stokes network put the show in front of exactly the right demo — at scale, in a format they actually watch.",
  },
  {
    name: "#TeamWater",
    logo: teamwaterLogo,
    campaign: '"Stay Hydrated" Mission Integration',
    formats: "Mission Video + Behind-the-Scenes + Instagram Reels",
    stats: [
      { label: "Total Impressions", value: "67M+" },
      { label: "Views Delivered", value: "51M+" },
      { label: "Avg. Engagement Rate", value: "5.2%" },
      { label: "Brand Recall Lift", value: "+28%" },
      { label: "Community Sign-Ups", value: "84K+" },
      { label: "Audience Retention", value: "69%" },
    ],
    quote: "The mission matched the audience's values — authentic integration that felt like content, not an ad.",
  },
];

function BrandModal({ brand, onClose }: { brand: Brand | null; onClose: () => void }) {
  return (
    <Dialog open={!!brand} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-[#0A0A0A] border border-[#F4F1EA]/10 text-[#F4F1EA] max-w-2xl p-0 overflow-hidden">
        {brand && (
          <>
            <div className="bg-[#141210] border-b border-[#F4F1EA]/10 px-8 py-6 flex items-center gap-6">
              <div className="w-24 h-14 flex items-center justify-center bg-black rounded-[4px] overflow-hidden flex-none">
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-[#E13B2C] mb-1">PARTNER SPOTLIGHT</div>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl text-[#F4F1EA] text-left">{brand.name}</DialogTitle>
                </DialogHeader>
                <div className="font-mono text-[11px] text-[#F4F1EA]/50 tracking-[0.08em] mt-1">{brand.campaign}</div>
              </div>
            </div>

            <div className="px-8 py-6">
              <div className="font-mono text-[10px] tracking-[0.24em] text-[#F4F1EA]/40 mb-3">FORMATS</div>
              <div className="font-sans text-sm text-[#F4F1EA]/70 mb-6">{brand.formats}</div>

              <div className="font-mono text-[10px] tracking-[0.24em] text-[#F4F1EA]/40 mb-4">CAMPAIGN RESULTS</div>
              <div className="grid grid-cols-3 gap-0 border-t border-[#F4F1EA]/10">
                {brand.stats.map((s, i) => (
                  <div
                    key={i}
                    className="py-4 px-3 border-b border-r border-[#F4F1EA]/10 last:border-r-0 [&:nth-child(3n)]:border-r-0"
                  >
                    <div className="font-display text-[28px] leading-none text-[#E13B2C] mb-2">{s.value}</div>
                    <div className="font-mono text-[10px] tracking-[0.12em] text-[#F4F1EA]/45 uppercase">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-l-2 border-[#E13B2C] pl-4">
                <p className="font-sans text-sm text-[#F4F1EA]/60 italic leading-relaxed">{brand.quote}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-[#F4F1EA]/10 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#F4F1EA]/35">READY TO BUILD YOUR CAMPAIGN?</span>
                <a
                  href="mailto:partnerships@stokestwins.com"
                  className="bg-[#E13B2C] text-white font-display text-[13px] px-5 py-3 rounded-[3px] hover:bg-white hover:text-[#0A0A0A] transition-colors"
                >
                  START A PARTNERSHIP →
                </a>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatBandItem({ end, suffix, label, desc, delay }: { end: number, suffix: string, label: string, desc: string, delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  const count = useCountUp(isVisible ? end : 0);
  
  return (
    <div ref={ref} className={`border-t-2 border-[#E13B2C] pt-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-[36px] md:text-[56px] font-display text-[#F4F1EA] leading-none mb-4">
        {count}{suffix}
      </div>
      <div className="font-mono font-bold text-xs tracking-widest text-[#E13B2C] mb-2">{label}</div>
      <div className="text-[#F4F1EA]/60 text-sm">{desc}</div>
    </div>
  );
}

const PLATFORMS = [
  { name: "YouTube", total: "141M", handle: "9 channels", color: "#FF0000", url: "https://www.youtube.com/@stokestwins", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { name: "TikTok", total: "30.8M", handle: "@stokestwins", color: "#F4F1EA", url: "https://www.tiktok.com/@stokestwins?lang=en", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.08-.14 1.62.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
  { name: "Snapchat", total: "38M", handle: "stokestwins", color: "#FFFC00", path: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.135-.06.255-.09.39-.045.179-.18.27-.405.27h-.015c-.135 0-.313-.029-.54-.074-.36-.075-.765-.135-1.273-.135-.3 0-.615.015-.93.074-.555.09-1.005.39-1.526.72-.795.524-1.711 1.107-3.07 1.107-.06 0-.12-.015-.18-.015-.075 0-.149.015-.225.015-1.356 0-2.272-.583-3.067-1.107-.524-.33-.975-.629-1.529-.72-.315-.045-.63-.074-.93-.074-.54 0-.96.089-1.273.149-.225.045-.404.074-.54.074-.314 0-.435-.18-.479-.36-.03-.119-.061-.249-.09-.389-.044-.195-.105-.479-.164-.57-1.873-.283-2.906-.703-3.146-1.272-.03-.075-.045-.149-.045-.225-.015-.24.165-.464.42-.509 3.265-.54 4.731-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.434-1.257-.928-1.197-1.273.09-.434.674-.733 1.168-.733.135 0 .256.029.36.074.405.194.764.299 1.064.299.234 0 .375-.06.45-.09l-.045-.569c-.105-1.62-.225-3.644.299-4.832C7.844 1.069 11.186.793 12.206.793z" },
  { name: "Instagram", total: "4.9M", handle: "@stokestwins", color: "#E1306C", url: "https://www.instagram.com/stokestwins/?hl=en", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { name: "Facebook", total: "18M", handle: "Stokes Twins", color: "#1877F2", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { name: "X", total: "9M", handle: "@stokestwins", color: "#F4F1EA", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
];

function PlatformCard({ p, i }: { p: typeof PLATFORMS[number] & { url?: string }; i: number }) {
  const { ref, isVisible } = useReveal(i * 80);
  const cardClass = `group bg-[#141210] border border-[#F4F1EA]/10 rounded-[6px] p-6 md:p-8 flex flex-col items-center text-center transition-all duration-500 hover:border-[#E13B2C]/40 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;
  const inner = (
    <>
      <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-14 md:h-14 mb-6 transition-transform duration-300 group-hover:scale-110" style={{ color: p.color }} fill="currentColor" aria-hidden="true">
        <path d={p.path} />
      </svg>
      <div className="font-display text-3xl md:text-[40px] text-[#F4F1EA] leading-none mb-2">{p.total}</div>
      <div className="font-mono text-xs tracking-widest text-[#F4F1EA]/70 mb-1">{p.name.toUpperCase()}</div>
      <div className="font-mono text-[11px] text-[#F4F1EA]/40">{p.handle}</div>
    </>
  );

  if (p.url) {
    return (
      <a
        ref={ref as unknown as React.RefObject<HTMLAnchorElement>}
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`platform-${p.name.toLowerCase()}`}
        aria-label={`Stokes Twins on ${p.name}`}
        className={cardClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <div ref={ref} className={cardClass}>
      {inner}
    </div>
  );
}

const DEMO_TABS = ["AGE", "GENDER", "GEOGRAPHY", "ENGAGEMENT"] as const;
type DemoTab = typeof DEMO_TABS[number];

function VBarLight({ label, percent, peak, delay }: { label: string; percent: number; peak: boolean; delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  const height = useBarGrow(isVisible ? (percent / 35) * 100 : 0);
  return (
    <div ref={ref} className="flex flex-col items-center justify-end h-[280px]">
      <div className="w-full relative flex items-end justify-center flex-grow mb-4">
        <div
          className={`w-full max-w-[56px] rounded-t-sm transition-all duration-75 ${peak ? 'bg-[#E13B2C]' : 'bg-[#141210]'}`}
          style={{ height: `${height}%` }}
        >
          <div className={`absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-sm font-bold ${peak ? 'text-[#E13B2C]' : 'text-[#0A0A0A]/70'}`}>
            {percent}%
          </div>
        </div>
      </div>
      <div className="font-mono text-xs text-[#0A0A0A]/60">{label}</div>
    </div>
  );
}

function HBar({ label, percent, max, accent, delay }: { label: string; percent: number; max: number; accent?: boolean; delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  const width = useBarGrow(isVisible ? (percent / max) * 100 : 0);
  return (
    <div ref={ref} className="flex items-center gap-4">
      <div className="w-32 md:w-40 font-mono text-sm text-[#0A0A0A]/80">{label}</div>
      <div className="flex-grow h-3 bg-[#0A0A0A]/10 rounded-full overflow-hidden">
        <div className={`h-full ${accent ? 'bg-[#E13B2C]' : 'bg-[#141210]'} transition-all duration-75`} style={{ width: `${width}%` }} />
      </div>
      <div className="w-12 text-right font-mono font-bold text-sm text-[#0A0A0A]">{percent}%</div>
    </div>
  );
}

function RetentionRing({ percent, delay }: { percent: number; delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  const grow = useBarGrow(isVisible ? percent : 0);
  const display = useCountUp(isVisible ? percent : 0);
  const r = 78;
  const circ = 2 * Math.PI * r;
  const offset = circ - (grow / 100) * circ;
  return (
    <div ref={ref} className="relative flex items-center justify-center w-[200px] h-[200px]">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#0A0A0A" strokeOpacity="0.1" strokeWidth="16" />
        <circle cx="100" cy="100" r={r} fill="none" stroke="#E13B2C" strokeWidth="16" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.075s linear' }} />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-[56px] leading-none text-[#0A0A0A]">{display}%</div>
        <div className="font-mono text-[10px] tracking-[0.2em] text-[#0A0A0A]/50 mt-1">AVG RETENTION</div>
      </div>
    </div>
  );
}

function MetricCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  return (
    <div ref={ref} className={`border-t-2 border-[#E13B2C] pt-5 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="font-display text-4xl md:text-5xl text-[#0A0A0A] leading-none mb-2">{value}</div>
      <div className="font-mono text-[11px] tracking-widest text-[#0A0A0A]/50">{label}</div>
    </div>
  );
}

function GenderBar({ percent, color, label, delay }: { percent: number; color: string; label: string; delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  const width = useBarGrow(isVisible ? percent : 0);
  return (
    <div ref={ref}>
      <div className="flex justify-between font-mono text-sm mb-2">
        <span className="text-[#0A0A0A]/80">{label}</span>
        <span className="font-bold" style={{ color }}>{percent}%</span>
      </div>
      <div className="h-4 bg-[#0A0A0A]/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-75" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function DemographicsTabs() {
  const [tab, setTab] = useState<DemoTab>("AGE");
  return (
    <div>
      <div role="tablist" aria-label="Audience demographics" className="flex flex-wrap gap-1 mb-12 border-b border-[#0A0A0A]/10">
        {DEMO_TABS.map((t, i) => (
          <button
            key={t}
            role="tab"
            id={`demo-tab-${t.toLowerCase()}`}
            aria-selected={tab === t}
            aria-controls="demo-panel"
            tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const dir = e.key === "ArrowRight" ? 1 : -1;
                setTab(DEMO_TABS[(i + dir + DEMO_TABS.length) % DEMO_TABS.length]);
              }
            }}
            data-testid={`demo-tab-${t.toLowerCase()}`}
            className={`font-mono text-xs tracking-[0.15em] px-5 py-3 -mb-px border-b-2 transition-colors ${tab === t ? 'border-[#E13B2C] text-[#0A0A0A]' : 'border-transparent text-[#0A0A0A]/40 hover:text-[#0A0A0A]'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div key={tab} role="tabpanel" id="demo-panel" aria-labelledby={`demo-tab-${tab.toLowerCase()}`} style={{ animation: 'rise 0.5s cubic-bezier(0.16,1,0.3,1) both' }} className="min-h-[340px]">
        {tab === "AGE" && (
          <div className="max-w-[760px]">
            <p className="font-sans text-lg text-[#0A0A0A]/60 mb-12 max-w-[520px]">More than half the audience is under 25 — the demographic brands fight hardest to reach.</p>
            <div className="grid grid-cols-5 gap-4 border-b border-[#0A0A0A]/20 pb-4">
              <VBarLight label="13-17" percent={22} peak={false} delay={0} />
              <VBarLight label="18-24" percent={31} peak={true} delay={80} />
              <VBarLight label="25-34" percent={27} peak={false} delay={160} />
              <VBarLight label="35-44" percent={13} peak={false} delay={240} />
              <VBarLight label="45+" percent={7} peak={false} delay={320} />
            </div>
          </div>
        )}

        {tab === "GENDER" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1000px]">
            <div className="space-y-8">
              <GenderBar label="Male" percent={58} color="#E13B2C" delay={0} />
              <GenderBar label="Female" percent={40} color="#141210" delay={120} />
              <GenderBar label="Other / Undisclosed" percent={2} color="#9C9488" delay={240} />
            </div>
            <p className="font-sans text-lg text-[#0A0A0A]/60">A balanced, family-first audience — co-viewing across parents and kids drives a broad, brand-safe reach.</p>
          </div>
        )}

        {tab === "GEOGRAPHY" && (
          <div className="max-w-[760px] space-y-6">
            <p className="font-sans text-lg text-[#0A0A0A]/60 mb-10 max-w-[520px]">A truly global footprint — anchored in the US, with strength across 190+ markets.</p>
            <HBar label="United States" percent={38} max={40} accent delay={0} />
            <HBar label="United Kingdom" percent={9} max={40} delay={100} />
            <HBar label="Brazil" percent={7} max={40} delay={200} />
            <HBar label="India" percent={6} max={40} delay={300} />
            <HBar label="Canada" percent={5} max={40} delay={400} />
            <HBar label="Rest of World" percent={35} max={40} delay={500} />
          </div>
        )}

        {tab === "ENGAGEMENT" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-start">
              <RetentionRing percent={71} delay={0} />
            </div>
            <div className="grid grid-cols-3 gap-8">
              <MetricCard value="2.4M" label="LIKES / VIDEO" delay={120} />
              <MetricCard value="84K" label="COMMENTS / VIDEO" delay={240} />
              <MetricCard value="1.1M" label="SHARES / VIDEO" delay={360} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type YtVideo = { img: string; title: string; tags: string[]; views: string; duration: string };
type YtShort = { img: string; title: string; views: string };

const HERO_VIDEO: YtVideo = {
  img: mysteryImg,
  title: "Last To Leave The Mystery Vault Keeps $100,000",
  tags: ["Mystery", "Competition", "Survival", "48 Hours"],
  views: "82M",
  duration: "21:14",
};

const YT_VIDEOS: YtVideo[] = [
  { img: gamingImg, title: "We Survived 100 Hours In Hardcore Mode", tags: ["Gaming", "Challenge"], views: "41M", duration: "18:02" },
  { img: outdoorImg, title: "Stranded On A Deserted Island For 7 Days", tags: ["Outdoor", "Survival"], views: "37M", duration: "24:51" },
  { img: trophyImg, title: "First To Find The Golden Trophy Wins It", tags: ["Trophy", "Competition"], views: "29M", duration: "16:33" },
];

const YT_SHORTS: YtShort[] = [
  { img: workBeat, title: "He never saw it coming", views: "12M" },
  { img: workHide, title: "Last one found wins", views: "8.4M" },
  { img: gamingImg, title: "Speedrun gone wrong", views: "15M" },
  { img: workCircle, title: "The circle of trust", views: "6.1M" },
  { img: outdoorImg, title: "48 hours in the wild", views: "9.7M" },
  { img: workTrophy, title: "Winner takes the trophy", views: "11M" },
  { img: mysteryImg, title: "Inside the mystery box", views: "20M" },
  { img: workDouble, title: "Double or nothing", views: "7.3M" },
  { img: trophyImg, title: "10K on the line", views: "5.9M" },
];

// Live subscriber ticker config. These will be driven by the admin/DB later:
// when the real count reaches YT_TARGET, bump YT_BASE up to the new floor,
// set YT_TARGET to the next milestone, and reset YT_ANCHOR_ISO to "now".
const YT_BASE = 140_000_000; // starting count
const YT_TARGET = 141_000_000; // cap — the "141M" the admin bumps to 142M when it hits
const YT_PER_MINUTE = 100; // how many the number gains each minute
const YT_ANCHOR_ISO = "2026-06-30T00:00:00Z"; // when the live count started

function liveYouTubeCount(): number {
  const anchor = Date.parse(YT_ANCHOR_ISO);
  const minutes = Math.max(0, Math.floor((Date.now() - anchor) / 60_000));
  return Math.min(YT_TARGET, YT_BASE + minutes * YT_PER_MINUTE);
}

function YouTubeCountUp() {
  const { ref, isVisible } = useReveal();
  const [introTarget] = useState(liveYouTubeCount);
  const [live, setLive] = useState(introTarget);
  const [introDone, setIntroDone] = useState(false);
  const intro = useCountUp(isVisible ? introTarget : 0, 5000);

  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => setIntroDone(true), 5100);
    return () => clearTimeout(t);
  }, [isVisible]);

  useEffect(() => {
    if (!introDone) return;
    setLive(liveYouTubeCount());
    const id = setInterval(() => setLive(liveYouTubeCount()), 1000);
    return () => clearInterval(id);
  }, [introDone]);

  const count = introDone ? live : intro;

  return (
    <div ref={ref} className="md:text-right" data-testid="youtube-countup">
      <div className="font-display text-[#E13B2C] text-[40px] md:text-[64px] leading-none tabular-nums">
        {count.toLocaleString()}
      </div>
      <div className="font-mono text-xs tracking-[0.2em] text-[#F4F1EA]/60 uppercase mt-3">
        Subscribers and counting
      </div>
    </div>
  );
}

function VideoCard({ video, featured = false }: { video: YtVideo; featured?: boolean }) {
  return (
    <div className="group relative rounded-[6px] overflow-hidden bg-[#141210] border border-[#F4F1EA]/10 hover:border-[#E13B2C]/50 transition-colors duration-300">
      <div className="relative aspect-video overflow-hidden">
        {/* Swap this <img> src with your GIF / real thumbnail */}
        <img src={video.img} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/10 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[80%]">
          {video.tags.map((t) => (
            <span key={t} className="font-mono text-[10px] tracking-widest uppercase bg-[#0A0A0A]/70 backdrop-blur-sm border border-white/15 px-2.5 py-1 rounded-full text-[#F4F1EA]">
              {t}
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[11px] bg-[#0A0A0A]/85 px-2 py-0.5 rounded text-[#F4F1EA]">
          {video.duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${featured ? "w-20 h-20" : "w-14 h-14"} rounded-full bg-[#E13B2C] flex items-center justify-center scale-90 opacity-85 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_30px_rgba(225,59,44,0.5)]`}>
            <svg viewBox="0 0 24 24" className={`${featured ? "w-8 h-8" : "w-5 h-5"} fill-white ml-1`}><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>
      <div className={featured ? "p-7" : "p-5"}>
        <h4 className={`font-display ${featured ? "text-2xl md:text-[34px]" : "text-lg"} leading-tight mb-2`}>{video.title}</h4>
        <div className="font-mono text-xs text-[#F4F1EA]/50 tracking-wide">{video.views} VIEWS</div>
      </div>
    </div>
  );
}

function ShortsCarousel({ shorts }: { shorts: YtShort[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const stop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const start = () => {
    if (rafRef.current !== null) return;
    const loop = () => {
      const el = scrollerRef.current;
      if (!el || velocityRef.current === 0) {
        rafRef.current = null;
        return;
      }
      el.scrollLeft += velocityRef.current;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => stop, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const edge = 0.35;
    const maxSpeed = 16;
    if (ratio > 1 - edge) {
      velocityRef.current = ((ratio - (1 - edge)) / edge) * maxSpeed;
    } else if (ratio < edge) {
      velocityRef.current = -((edge - ratio) / edge) * maxSpeed;
    } else {
      velocityRef.current = 0;
    }
    if (velocityRef.current !== 0) start();
    else stop();
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => {
          velocityRef.current = 0;
          stop();
        }}
        className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-testid="shorts-carousel"
      >
        {shorts.map((s) => (
          <div key={s.title} className="group relative shrink-0 w-[190px] md:w-[230px] aspect-[9/16] rounded-[8px] overflow-hidden bg-[#141210] border border-[#F4F1EA]/10">
            {/* Swap this <img> src with your GIF / Short */}
            <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/10" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#0A0A0A]/60 backdrop-blur-sm px-2 py-1 rounded-full">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#E13B2C]"><path d="M8 5v14l11-7z" /></svg>
              <span className="font-mono text-[9px] tracking-widest text-white/85 uppercase">Short</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-sans font-bold text-sm text-white leading-tight mb-1 line-clamp-2">{s.title}</div>
              <div className="font-mono text-[10px] text-[#F4F1EA]/60">{s.views} views</div>
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent" />
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);

  useEffect(() => {
    document.title = "Stokes Twins | Media Kit";
    document.body.style.backgroundColor = "#0A0A0A";
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) requestAnimationFrame(() => el.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F1EA] overflow-x-hidden">
      <Nav />

      {/* Hero Section */}
      <section 
        className="relative w-full h-screen min-h-[760px] flex flex-col justify-center items-center overflow-hidden"
        data-testid="hero-section"
      >
        <div className="absolute inset-0 z-0 bg-[#0A0A0A]" />
        
        {/* Animated Gradient */}
        <div 
          className="absolute inset-0 z-0 animate-drift opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(120% 95% at 72% 8%, rgba(225,59,44,.62), transparent 52%), 
              radial-gradient(110% 90% at 16% 96%, rgba(123,26,18,.7), transparent 58%), 
              radial-gradient(80% 70% at 50% 50%, rgba(225,59,44,.18), transparent 60%), 
              linear-gradient(155deg, #230906, #0A0A0A 70%)
            `
          }}
        />
        
        {/* Sweep Light */}
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay overflow-hidden">
          <div className="absolute top-0 bottom-0 w-[200%] bg-gradient-to-r from-transparent via-white to-transparent animate-sweep" />
        </div>

        {/* Grain */}
        <div className="absolute inset-0 z-0 opacity-16 mix-blend-overlay animate-grain pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        </div>

        {/* Scrim */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0A0A0A]/32 via-[#0A0A0A]/18 to-[#0A0A0A]/62" />

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-[1000px] mt-20">
          <div className="animate-rise font-mono font-bold text-[#E13B2C] text-[12px] tracking-[0.4em] mb-8">
            CREATOR-LED FAMILY ENTERTAINMENT STUDIO
          </div>
          
          <div className="animate-rise" style={{ animationDelay: '0.1s' }}>
            <Wordmark size="hero" className="mb-10" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-rise" style={{ animationDelay: '0.2s' }}>
            <a
              href="https://www.tiktok.com/@stokestwins?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-social-tiktok"
              aria-label="Stokes Twins on TikTok"
              className="flex items-center gap-3 bg-[#0A0A0A]/40 backdrop-blur-md border border-[#F4F1EA]/10 px-5 py-2.5 rounded-full transition-colors hover:border-[#F4F1EA]/40 hover:bg-[#0A0A0A]/60"
            >
              <div className="w-3 h-3 rounded-full bg-[#25F4EE] shadow-[2px_0_0_#FE2C55]" />
              <span className="font-mono text-xs tracking-widest font-bold">TIKTOK</span>
              <span className="font-mono text-xs text-[#F4F1EA]/60">30.8M</span>
            </a>
            
            <a
              href="https://www.youtube.com/@stokestwins"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-social-youtube"
              aria-label="Stokes Twins on YouTube"
              className="flex items-center gap-3 bg-gradient-to-r from-[#E13B2C] to-[#7B1A12] px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(225,59,44,0.3)] transition-transform hover:scale-[1.03]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span className="font-mono text-xs tracking-widest font-bold">YOUTUBE</span>
              <span className="font-mono text-xs text-white/80">141M</span>
            </a>

            <a
              href="https://www.instagram.com/stokestwins/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-social-instagram"
              aria-label="Stokes Twins on Instagram"
              className="flex items-center gap-3 bg-[#0A0A0A]/40 backdrop-blur-md border border-[#F4F1EA]/10 px-5 py-2.5 rounded-full transition-colors hover:border-[#F4F1EA]/40 hover:bg-[#0A0A0A]/60"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#C13584]" />
              <span className="font-mono text-xs tracking-widest font-bold">INSTAGRAM</span>
              <span className="font-mono text-xs text-[#F4F1EA]/60">4.9M</span>
            </a>
          </div>

          <p 
            className="font-sans font-extrabold text-[clamp(15px,2vw,21px)] leading-relaxed text-[#F4F1EA]/90 max-w-[800px] mb-12 animate-rise"
            style={{ animationDelay: '0.3s' }}
            data-testid="hero-tagline"
          >
            The largest creator-led family entertainment studio — 250 million followers, a transmedia slate, and a global tentpole event every single month.
          </p>

          <a 
            href="#partner"
            className="animate-rise bg-white text-[#0A0A0A] font-display text-[17px] px-[34px] py-[18px] rounded-[3px] hover:bg-[#E13B2C] hover:text-white transition-colors"
            style={{ animationDelay: '0.4s' }}
            data-testid="hero-cta-btn"
          >
            PARTNER WITH US →
          </a>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-t border-[#E13B2C] bg-[#0A0A0A] overflow-hidden py-4">
        <div className="whitespace-nowrap flex w-[200%] animate-marq">
          {Array(4).fill("GAMING · OUTDOOR · MYSTERY · TROPHY · CHALLENGES · SHORTS · ").map((text, i) => (
            <span key={i} className="font-display text-2xl md:text-3xl text-[#F4F1EA]/20 mx-4">{text}</span>
          ))}
        </div>
      </div>

      {/* Section 01 - THE NUMBERS */}
      <section id="audience" className="py-32 px-6 bg-[#0A0A0A]" data-testid="section-numbers">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">01 — THE NUMBERS</h3>
              <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1] mb-8">An audience that doesn't scroll past.</h2>
            </div>
            <div className="flex items-end pb-4">
              <p className="font-sans text-xl md:text-2xl text-[#F4F1EA]/70 leading-relaxed font-medium">
                Alan and Alex Stokes turn stories into global franchises — a transmedia studio spanning blockbuster YouTube formats, unscripted, scripted, animation, and live, operating at the scale of a tentpole event every month.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            <StatBandItem end={250} suffix="M+" label="FOLLOWERS" desc="Across every platform" delay={0} />
            <StatBandItem end={1.2} suffix="B" label="MONTHLY VIEWS" desc="Every 30 days, and climbing" delay={150} />
            <StatBandItem end={62} suffix="B" label="LIFETIME VIEWS" desc="Since the first upload" delay={300} />
            <StatBandItem end={9} suffix="" label="OWNED CHANNELS" desc="One connected network" delay={450} />
          </div>
        </div>
      </section>

      {/* Section 02 - THE ENGINE (YouTube) */}
      <section id="youtube" className="py-32 px-6 bg-[#0A0A0A] border-t border-[#F4F1EA]/10" data-testid="section-youtube">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">02 — THE ENGINE</h3>
              <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">YouTube is the Engine.</h2>
            </div>
            <YouTubeCountUp />
          </div>

          {/* Hero YouTube video */}
          <div className="mb-6">
            <VideoCard video={HERO_VIDEO} featured />
          </div>

          {/* 3 more videos, 16:9 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {YT_VIDEOS.map((v) => (
              <VideoCard key={v.title} video={v} />
            ))}
          </div>

          {/* Shorts carousel */}
          <div className="flex items-end justify-between mb-8 gap-4">
            <h3 className="font-display text-3xl md:text-4xl">Shorts that hit.</h3>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#F4F1EA]/40 uppercase hidden md:block whitespace-nowrap">
              Hover near an edge to scroll →
            </span>
          </div>
          <ShortsCarousel shorts={YT_SHORTS} />
        </div>
      </section>

      {/* Section 03 - THE NETWORK */}
      <section id="channels" className="py-32 px-6 bg-[#0A0A0A] border-t border-[#F4F1EA]/10" data-testid="section-channels">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">03 — THE NETWORK</h3>
              <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">One audience, every platform.</h2>
            </div>
            <p className="font-sans text-xl text-[#F4F1EA]/70 leading-relaxed font-medium md:pb-3">
              A native presence on every platform that matters — a connected network that moves as one.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {PLATFORMS.map((p, i) => (
              <PlatformCard key={p.name} p={p} i={i} />
            ))}
          </div>

          {/* More to come — centered teaser */}
          <div className="mt-20 pt-14 border-t border-[#F4F1EA]/10 text-center" data-testid="more-to-come">
            <div className="font-mono text-[10px] tracking-[0.45em] text-[#F4F1EA]/40 mb-5 animate-pulse">THE NETWORK IS EXPANDING</div>
            <h3
              className="font-display text-[44px] md:text-[80px] leading-none inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(110deg, rgba(244,241,234,0.55) 30%, #FFFFFF 47%, #E13B2C 50%, #FFFFFF 53%, rgba(244,241,234,0.55) 70%)",
                backgroundSize: "200% auto",
                animation: "shimmer 5s linear infinite",
              }}
            >
              More to come
            </h3>
            <div className="flex justify-center gap-2 mt-7">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-[#E13B2C] animate-pulse"
                  style={{ animationDelay: `${d * 0.25}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 04 - WHO'S WATCHING */}
      <section id="demographics" className="py-32 px-6 bg-[#F4F1EA] text-[#0A0A0A]" data-testid="section-demographics">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">04 — WHO'S WATCHING</h3>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1] max-w-[800px]">Gen-Z and young millennials, leaning all the way in.</h2>
          </div>

          <DemographicsTabs />
        </div>
      </section>

      {/* Partner CTA */}
      <section id="partner" className="py-32 px-6 bg-[#E13B2C] text-white text-center" data-testid="section-partner-cta">
        <div className="max-w-[1000px] mx-auto">
          <h3 className="font-mono font-bold text-xs tracking-[0.3em] mb-8 text-white/90">05 — PRESS PLAY WITH US</h3>
          <h2 className="font-display text-[clamp(48px,8vw,88px)] leading-[1] mb-8 drop-shadow-md">Put Your Brand In Play</h2>
          <p className="font-sans text-xl md:text-2xl font-medium max-w-[800px] mx-auto mb-16 opacity-90">
            Custom integrations, title sponsorships, and cross-platform campaigns designed for the world's largest family audience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24">
            <a
              href="mailto:partnerships@stokestwins.com"
              className="bg-[#0A0A0A] text-white font-display text-lg px-8 py-5 rounded-[3px] hover:bg-white hover:text-[#0A0A0A] transition-colors w-full sm:w-auto text-center"
            >
              START A PARTNERSHIP →
            </a>
            <button className="bg-transparent border-2 border-white/30 text-white font-display text-lg px-8 py-5 rounded-[3px] hover:bg-white hover:text-[#E13B2C] transition-colors w-full sm:w-auto">
              DOWNLOAD MEDIA KIT
            </button>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest opacity-60 mb-10 uppercase">TRUSTED BY BRANDS THAT GO BIG</div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              {BRANDS.map((brand, i) => (
                <button
                  key={brand.name}
                  onClick={() => setActiveBrand(brand)}
                  data-testid={`brand-logo-${brand.name.toLowerCase().replace(/[^a-z]/g, '')}`}
                  title={`View ${brand.name} partnership stats`}
                  className="group relative w-[160px] h-[160px] rounded-[6px] overflow-hidden cursor-pointer"
                  style={{
                    animation: `brandReveal 0.6s cubic-bezier(0.16,1,0.3,1) both`,
                    animationDelay: `${0.1 + i * 0.12}s`,
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-[6px]" />
                  <div className="absolute inset-0 rounded-[6px] ring-0 group-hover:ring-2 group-hover:ring-white/40 transition-all duration-300" />
                </button>
              ))}
            </div>
            <div className="mt-6 font-mono text-[10px] tracking-[0.2em] opacity-40 uppercase">Click a logo to see campaign results</div>
          </div>
        </div>
      </section>

      {/* Careers Teaser */}
      <section className="py-32 px-6 bg-[#141210] border-t border-[#F4F1EA]/10" data-testid="section-careers-teaser">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">10 ROLES OPEN · NOW HIRING</div>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">Join the production.</h2>
          </div>
          <div>
            <p className="font-sans text-xl text-[#F4F1EA]/70 mb-8 max-w-[600px]">
              We're building the team behind the numbers — editors, producers, strategists, and story minds who move at the speed of the feed.
            </p>
            <Link 
              href="/careers" 
              className="group font-display text-2xl md:text-3xl flex items-center gap-4"
            >
              <span className="border-b-[4px] border-[#E13B2C] pb-1 group-hover:text-[#E13B2C] transition-colors">SEE OPEN ROLES</span>
              <span className="text-[#E13B2C] group-hover:translate-x-4 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <BrandModal brand={activeBrand} onClose={() => setActiveBrand(null)} />
    </div>
  );
}
