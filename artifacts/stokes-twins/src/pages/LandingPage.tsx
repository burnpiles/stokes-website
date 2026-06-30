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

function BarChartRow({ label, percent, delay }: { label: string, percent: number, delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  const width = useBarGrow(isVisible ? percent : 0);

  return (
    <div ref={ref} className={`mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
      <div className="flex justify-between font-mono text-sm mb-2">
        <span className="text-[#F4F1EA]">{label}</span>
        <span className="text-[#E13B2C] font-bold">{percent}%</span>
      </div>
      <div className="h-2 w-full bg-[#141210] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#E13B2C] transition-all duration-75"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function VerticalBar({ label, percent, isPeak, delay }: { label: string, percent: number, isPeak: boolean, delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  const height = useBarGrow(isVisible ? percent : 0);

  return (
    <div ref={ref} className="flex flex-col items-center justify-end h-[240px]">
      <div className="w-full relative flex items-end justify-center h-full mb-4">
        <div 
          className={`w-full max-w-[40px] rounded-t-sm transition-all duration-75 ${isPeak ? 'bg-[#E13B2C]' : 'bg-[#141210]'}`}
          style={{ height: `${height}%` }}
        >
          <div className={`absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs font-bold ${isPeak ? 'text-[#E13B2C]' : 'text-[#F4F1EA]/60'} opacity-0 transition-opacity duration-300 delay-500 ${isVisible ? 'opacity-100' : ''}`}>
            {percent}%
          </div>
        </div>
      </div>
      <div className="font-mono text-xs text-[#F4F1EA]/60">{label}</div>
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

function YouTubeCountUp() {
  const { ref, isVisible } = useReveal();
  const count = useCountUp(isVisible ? 140000000 : 0, 5000);
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
            <div className="flex items-center gap-3 bg-[#0A0A0A]/40 backdrop-blur-md border border-[#F4F1EA]/10 px-5 py-2.5 rounded-full">
              <div className="w-3 h-3 rounded-full bg-[#25F4EE] shadow-[2px_0_0_#FE2C55]" />
              <span className="font-mono text-xs tracking-widest font-bold">TIKTOK</span>
              <span className="font-mono text-xs text-[#F4F1EA]/60">30.8M</span>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#E13B2C] to-[#7B1A12] px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(225,59,44,0.3)]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span className="font-mono text-xs tracking-widest font-bold">YOUTUBE</span>
              <span className="font-mono text-xs text-white/80">141M</span>
            </div>

            <div className="flex items-center gap-3 bg-[#0A0A0A]/40 backdrop-blur-md border border-[#F4F1EA]/10 px-5 py-2.5 rounded-full">
              <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#C13584]" />
              <span className="font-mono text-xs tracking-widest font-bold">INSTAGRAM</span>
              <span className="font-mono text-xs text-[#F4F1EA]/60">4.9M</span>
            </div>
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

      {/* Section 02 - WHAT THEY WATCH */}
      <section id="categories" className="py-32 px-6 bg-[#F4F1EA] text-[#0A0A0A]" data-testid="section-categories">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-20">
            <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">02 — WHAT THEY WATCH</h3>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">Four worlds. One audience.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { cat: "GAMING", pct: 34, color: "#2BB6D9", img: gamingImg, desc: "High-stakes gaming formats." },
              { cat: "OUTDOOR", pct: 26, color: "#1F8A5B", img: outdoorImg, desc: "Massive IRL survival challenges." },
              { cat: "MYSTERY", pct: 22, color: "#6B3FB5", img: mysteryImg, desc: "Escape rooms and puzzles." },
              { cat: "TROPHY", pct: 18, color: "#E8B547", img: trophyImg, desc: "Luxury and prize-based events." }
            ].map((item, i) => (
              <div 
                key={item.cat}
                className="bg-[#141210] rounded-[4px] overflow-hidden group hover:-translate-y-[7px] transition-transform duration-300 relative border border-transparent hover:border-[#F4F1EA]/20 flex flex-col"
              >
                <div className="h-[5px] w-full" style={{ backgroundColor: item.color }} />
                <div className="h-[188px] relative overflow-hidden bg-[#0A0A0A]">
                  <img src={item.img} alt={item.cat} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 font-mono text-[10px] font-bold tracking-widest px-2 py-1 rounded bg-[#0A0A0A]/80 text-white backdrop-blur border border-white/10" style={{ color: item.color }}>
                    {item.cat}
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="font-display text-[64px] leading-none mb-2 text-white">{item.pct}%</div>
                  <div className="font-mono text-sm tracking-widest text-[#F4F1EA]/60 mb-4">{item.cat} VOD</div>
                  <p className="font-sans text-[#F4F1EA]/80 mt-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 03 - WHERE THEY WATCH */}
      <section id="channels" className="py-32 px-6 bg-[#0A0A0A]" data-testid="section-channels">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-20">
            <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">03 — WHERE THEY WATCH</h3>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">Native everywhere it matters.</h2>
          </div>

          <div className="space-y-2">
            <BarChartRow label="YouTube" percent={52} delay={0} />
            <BarChartRow label="YouTube Shorts" percent={28} delay={100} />
            <BarChartRow label="TikTok" percent={11} delay={200} />
            <BarChartRow label="Instagram Reels" percent={6} delay={300} />
            <BarChartRow label="Facebook" percent={3} delay={400} />
          </div>
        </div>
      </section>

      {/* Section 04 - THE ENGINE (YouTube) */}
      <section id="youtube" className="py-32 px-6 bg-[#0A0A0A] border-t border-[#F4F1EA]/10" data-testid="section-youtube">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">04 — THE ENGINE</h3>
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

      {/* Section 05 - WHO'S WATCHING */}
      <section id="demographics" className="py-32 px-6 bg-[#F4F1EA] text-[#0A0A0A]" data-testid="section-demographics">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-20">
            <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">05 — WHO'S WATCHING</h3>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1] max-w-[800px]">Gen-Z and young millennials, leaning all the way in.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
            {/* Age Bar Chart */}
            <div>
              <h4 className="font-mono font-bold text-sm tracking-widest mb-12 border-b border-[#0A0A0A]/10 pb-4">AGE DISTRIBUTION</h4>
              <div className="grid grid-cols-5 gap-4 h-[240px] items-end border-b border-[#0A0A0A]/20 pb-4">
                <VerticalBar label="13-17" percent={22} isPeak={false} delay={0} />
                <VerticalBar label="18-24" percent={31} isPeak={true} delay={100} />
                <VerticalBar label="25-34" percent={27} isPeak={false} delay={200} />
                <VerticalBar label="35-44" percent={13} isPeak={false} delay={300} />
                <VerticalBar label="45+" percent={7} isPeak={false} delay={400} />
              </div>
            </div>

            {/* Gender & Geo */}
            <div>
              <div className="mb-16">
                <h4 className="font-mono font-bold text-sm tracking-widest mb-8 border-b border-[#0A0A0A]/10 pb-4">GENDER SPLIT</h4>
                <div className="flex h-8 rounded-sm overflow-hidden mb-4">
                  <div className="bg-[#E13B2C] h-full flex items-center px-4 text-xs font-bold font-mono text-white" style={{ width: '58%' }}>58%</div>
                  <div className="bg-[#141210] h-full flex items-center px-4 text-xs font-bold font-mono text-white" style={{ width: '40%' }}>40%</div>
                  <div className="bg-[#0A0A0A]/20 h-full" style={{ width: '2%' }}></div>
                </div>
                <div className="flex gap-6 font-mono text-xs">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#E13B2C]"></div> Male</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#141210]"></div> Female</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#0A0A0A]/20"></div> Other</div>
                </div>
              </div>

              <div>
                <h4 className="font-mono font-bold text-sm tracking-widest mb-8 border-b border-[#0A0A0A]/10 pb-4">TOP MARKETS</h4>
                <div className="space-y-4">
                  {[
                    { country: "United States", pct: 38 },
                    { country: "United Kingdom", pct: 9 },
                    { country: "Brazil", pct: 7 },
                    { country: "India", pct: 6 },
                    { country: "Canada", pct: 5 }
                  ].map((market, i) => (
                    <div key={market.country} className="flex items-center gap-4">
                      <div className="w-32 font-mono text-sm">{market.country}</div>
                      <div className="flex-grow h-2 bg-[#0A0A0A]/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#141210]" style={{ width: `${market.pct}%` }}></div>
                      </div>
                      <div className="w-12 text-right font-mono font-bold text-sm">{market.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[#0A0A0A]/10">
            <div className="font-mono text-center">
              <div className="text-3xl font-bold mb-1">71%</div>
              <div className="text-xs tracking-widest text-[#0A0A0A]/60">AVG RETENTION</div>
            </div>
            <div className="font-mono text-center">
              <div className="text-3xl font-bold mb-1">2.4M</div>
              <div className="text-xs tracking-widest text-[#0A0A0A]/60">LIKES/VIDEO</div>
            </div>
            <div className="font-mono text-center">
              <div className="text-3xl font-bold mb-1">84K</div>
              <div className="text-xs tracking-widest text-[#0A0A0A]/60">COMMENTS/VIDEO</div>
            </div>
            <div className="font-mono text-center">
              <div className="text-3xl font-bold mb-1">1.1M</div>
              <div className="text-xs tracking-widest text-[#0A0A0A]/60">SHARES/VIDEO</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 06 - THE WORK */}
      <section id="work" className="py-32 px-6 bg-[#0A0A0A]" data-testid="section-work">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-20">
            <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">06 — THE WORK</h3>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">Productions brands wanted in on.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured */}
            <div className="lg:col-span-2 group relative rounded-[4px] overflow-hidden bg-[#141210] block cursor-pointer">
              <div className="aspect-[2/1] relative">
                <img src={workDouble} alt="Double or Nothing" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="font-mono text-[10px] font-bold tracking-widest px-2 py-1 rounded bg-[#E13B2C] text-white">CHALLENGES</span>
                    <span className="font-mono text-sm text-[#F4F1EA]/80 font-bold">312M VIEWS</span>
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl mb-4 group-hover:text-[#E13B2C] transition-colors">Double or Nothing</h3>
                  <div className="font-mono text-xs tracking-widest text-[#F4F1EA]/60 border-t border-[#F4F1EA]/20 pt-4 inline-block">PRESENTED BY — YOUR BRAND HERE</div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E13B2C]/50 rounded-[4px] pointer-events-none transition-colors duration-300" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-[4px] overflow-hidden bg-[#141210] cursor-pointer">
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative">
                <img src={workCircle} alt="Last to Leave the Circle" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="font-mono text-[10px] font-bold tracking-widest px-2 py-1 rounded bg-[#1F8A5B] text-white">OUTDOOR</span>
                    <span className="font-mono text-sm text-[#E13B2C] font-bold">188M VIEWS</span>
                  </div>
                  <h3 className="font-display text-2xl group-hover:text-[#E13B2C] transition-colors">Last to Leave the Circle</h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E13B2C]/50 rounded-[4px] pointer-events-none transition-colors duration-300" />
              </div>
            </div>

            {/* Cards 3-5 */}
            {[
              { title: "$100K Hide & Seek", cat: "MYSTERY", views: "241M", color: "#6B3FB5", img: workHide },
              { title: "Beat the Pro", cat: "GAMING", views: "156M", color: "#2BB6D9", img: workBeat },
              { title: "Trophy Run: Finale", cat: "TROPHY", views: "203M", color: "#E8B547", img: workTrophy }
            ].map((item, i) => (
              <div key={i} className="group relative rounded-[4px] overflow-hidden bg-[#141210] cursor-pointer">
                <div className="aspect-[4/3] relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="font-mono text-[10px] font-bold tracking-widest px-2 py-1 rounded text-white" style={{ backgroundColor: item.color }}>{item.cat}</span>
                      <span className="font-mono text-sm text-[#E13B2C] font-bold">{item.views} VIEWS</span>
                    </div>
                    <h3 className="font-display text-2xl group-hover:text-[#E13B2C] transition-colors">{item.title}</h3>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E13B2C]/50 rounded-[4px] pointer-events-none transition-colors duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section id="partner" className="py-32 px-6 bg-[#E13B2C] text-white text-center" data-testid="section-partner-cta">
        <div className="max-w-[1000px] mx-auto">
          <div className="font-mono font-bold text-xs tracking-[0.4em] mb-8">PRESS PLAY WITH US</div>
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
