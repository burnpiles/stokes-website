import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Wordmark } from "@/components/Wordmark";
import { useCountUp } from "@/hooks/useCountUp";
import { useReveal } from "@/hooks/useReveal";
import { useBarGrow } from "@/hooks/useBarGrow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useContent } from "@/lib/content";
import { resolveImg } from "@/lib/resolveImg";
import { platformIcon } from "@/lib/platformIcons";
import type {
  Brand,
  Demographic,
  Platform,
  Settings,
  Short,
  Stat,
  Video,
} from "@workspace/api-client-react";

function BrandModal({ brand, onClose, logline }: { brand: Brand | null; onClose: () => void; logline: string }) {
  return (
    <Dialog open={!!brand} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-[#0A0A0A] border border-[#F4F1EA]/10 text-[#F4F1EA] max-w-2xl p-0 overflow-hidden">
        {brand && (
          <>
            <div className="bg-[#141210] border-b border-[#F4F1EA]/10 px-8 py-6 flex items-center gap-6">
              <div className="w-24 h-14 flex items-center justify-center bg-black rounded-[4px] overflow-hidden flex-none">
                <img src={resolveImg(brand.logoUrl)} alt={brand.name} className="w-full h-full object-contain" />
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
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#F4F1EA]/35">{logline}</span>
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

function PlatformCard({ p, i }: { p: Platform; i: number }) {
  const { ref, isVisible } = useReveal(i * 80);
  const cardClass = `group bg-[#141210] border border-[#F4F1EA]/10 rounded-[6px] p-6 md:p-8 flex flex-col items-center text-center transition-all duration-500 hover:border-[#E13B2C]/40 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;
  const inner = (
    <>
      <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-14 md:h-14 mb-6 transition-transform duration-300 group-hover:scale-110" style={{ color: p.color }} fill="currentColor" aria-hidden="true">
        <path d={platformIcon(p.iconKey)} />
      </svg>
      <div className="font-display text-3xl md:text-[40px] text-[#F4F1EA] leading-none mb-2">{p.value}</div>
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

const GENDER_COLORS = ["#E13B2C", "#141210", "#9C9488"];

function DemographicsTabs({ demographics, settings }: { demographics: Demographic[]; settings: Settings }) {
  const [tab, setTab] = useState<DemoTab>("AGE");
  const byCat = (cat: string) =>
    demographics.filter((d) => d.category === cat).sort((a, b) => a.sortOrder - b.sortOrder);
  const age = byCat("age");
  const gender = byCat("gender");
  const geo = byCat("geography");
  const geoMax = Math.max(...geo.map((g) => g.percent), 1);
  const demoCopy = settings.demographicsSection;
  const eng = settings.engagement;

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
            <p className="font-sans text-lg text-[#0A0A0A]/60 mb-12 max-w-[520px]">{demoCopy.ageSubcopy}</p>
            <div className="grid gap-4 border-b border-[#0A0A0A]/20 pb-4" style={{ gridTemplateColumns: `repeat(${age.length || 1}, minmax(0, 1fr))` }}>
              {age.map((d, i) => (
                <VBarLight key={d.id} label={d.label} percent={d.percent} peak={d.highlight} delay={i * 80} />
              ))}
            </div>
          </div>
        )}

        {tab === "GENDER" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1000px]">
            <div className="space-y-8">
              {gender.map((d, i) => (
                <GenderBar key={d.id} label={d.label} percent={d.percent} color={GENDER_COLORS[i] ?? "#9C9488"} delay={i * 120} />
              ))}
            </div>
            <p className="font-sans text-lg text-[#0A0A0A]/60">{demoCopy.genderSubcopy}</p>
          </div>
        )}

        {tab === "GEOGRAPHY" && (
          <div className="max-w-[760px] space-y-6">
            <p className="font-sans text-lg text-[#0A0A0A]/60 mb-10 max-w-[520px]">{demoCopy.geographySubcopy}</p>
            {geo.map((d, i) => (
              <HBar key={d.id} label={d.label} percent={d.percent} max={geoMax} accent={d.percent === geoMax} delay={i * 100} />
            ))}
          </div>
        )}

        {tab === "ENGAGEMENT" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-start">
              <RetentionRing percent={eng.avgRetention} delay={0} />
            </div>
            <div className="grid grid-cols-3 gap-8">
              <MetricCard value={eng.likes} label="LIKES / VIDEO" delay={120} />
              <MetricCard value={eng.comments} label="COMMENTS / VIDEO" delay={240} />
              <MetricCard value={eng.shares} label="SHARES / VIDEO" delay={360} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function liveYouTubeCount(c: Settings["youtubeCounter"]): number {
  const anchor = Date.parse(c.anchorIso);
  const minutes = Math.max(0, Math.floor((Date.now() - anchor) / 60_000));
  return Math.min(c.target, c.base + minutes * c.perMinute);
}

function YouTubeCountUp({ counter }: { counter: Settings["youtubeCounter"] }) {
  const { ref, isVisible } = useReveal();
  const [introTarget] = useState(() => liveYouTubeCount(counter));
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
    setLive(liveYouTubeCount(counter));
    const id = setInterval(() => setLive(liveYouTubeCount(counter)), 1000);
    return () => clearInterval(id);
  }, [introDone, counter]);

  const count = introDone ? live : intro;

  return (
    <div ref={ref} className="md:text-right" data-testid="youtube-countup">
      <div className="font-display text-[#E13B2C] text-[40px] md:text-[64px] leading-none tabular-nums">
        {count.toLocaleString()}
      </div>
      <div className="font-mono text-xs tracking-[0.2em] text-[#F4F1EA]/60 uppercase mt-3">
        {counter.subLabel}
      </div>
    </div>
  );
}

function VideoCard({ video, featured = false }: { video: Video; featured?: boolean }) {
  return (
    <div className="group relative rounded-[6px] overflow-hidden bg-[#141210] border border-[#F4F1EA]/10 hover:border-[#E13B2C]/50 transition-colors duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img src={resolveImg(video.thumbnailUrl)} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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

function ShortsCarousel({ shorts }: { shorts: Short[] }) {
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
          <div key={s.id} className="group relative shrink-0 w-[190px] md:w-[230px] aspect-[9/16] rounded-[8px] overflow-hidden bg-[#141210] border border-[#F4F1EA]/10">
            <img src={resolveImg(s.thumbnailUrl)} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
  const content = useContent();
  const { settings, stats, platforms, videos, shorts, demographics, brands, jobs } = content;
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);

  const heroVideo = videos.find((v) => v.featured) ?? videos[0];
  const gridVideos = heroVideo ? videos.filter((v) => v.id !== heroVideo.id) : videos;
  const activeJobs = jobs.filter((j) => j.active);
  const social = settings.socials;

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
            {settings.hero.eyebrow}
          </div>

          <div className="animate-rise" style={{ animationDelay: '0.1s' }}>
            <Wordmark size="hero" className="mb-10" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-rise" style={{ animationDelay: '0.2s' }}>
            <a
              href={social.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-social-tiktok"
              aria-label="Stokes Twins on TikTok"
              className="flex items-center gap-3 bg-[#0A0A0A]/40 backdrop-blur-md border border-[#F4F1EA]/10 px-5 py-2.5 rounded-full transition-colors hover:border-[#F4F1EA]/40 hover:bg-[#0A0A0A]/60"
            >
              <div className="w-3 h-3 rounded-full bg-[#25F4EE] shadow-[2px_0_0_#FE2C55]" />
              <span className="font-mono text-xs tracking-widest font-bold">TIKTOK</span>
              <span className="font-mono text-xs text-[#F4F1EA]/60">{social.tiktok.value}</span>
            </a>

            <a
              href={social.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-social-youtube"
              aria-label="Stokes Twins on YouTube"
              className="flex items-center gap-3 bg-gradient-to-r from-[#E13B2C] to-[#7B1A12] px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(225,59,44,0.3)] transition-transform hover:scale-[1.03]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span className="font-mono text-xs tracking-widest font-bold">YOUTUBE</span>
              <span className="font-mono text-xs text-white/80">{social.youtube.value}</span>
            </a>

            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-social-instagram"
              aria-label="Stokes Twins on Instagram"
              className="flex items-center gap-3 bg-[#0A0A0A]/40 backdrop-blur-md border border-[#F4F1EA]/10 px-5 py-2.5 rounded-full transition-colors hover:border-[#F4F1EA]/40 hover:bg-[#0A0A0A]/60"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#C13584]" />
              <span className="font-mono text-xs tracking-widest font-bold">INSTAGRAM</span>
              <span className="font-mono text-xs text-[#F4F1EA]/60">{social.instagram.value}</span>
            </a>
          </div>

          <p
            className="font-sans font-extrabold text-[clamp(15px,2vw,21px)] leading-relaxed text-[#F4F1EA]/90 max-w-[800px] mb-12 animate-rise"
            style={{ animationDelay: '0.3s' }}
            data-testid="hero-tagline"
          >
            {settings.hero.tagline}
          </p>

          <a
            href={settings.hero.ctaHref}
            className="animate-rise bg-white text-[#0A0A0A] font-display text-[17px] px-[34px] py-[18px] rounded-[3px] hover:bg-[#E13B2C] hover:text-white transition-colors"
            style={{ animationDelay: '0.4s' }}
            data-testid="hero-cta-btn"
          >
            {settings.hero.ctaLabel}
          </a>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-t border-[#E13B2C] bg-[#0A0A0A] overflow-hidden py-4">
        <div className="whitespace-nowrap flex w-[200%] animate-marq">
          {Array(4).fill(settings.marqueeText).map((text, i) => (
            <span key={i} className="font-display text-2xl md:text-3xl text-[#F4F1EA]/20 mx-4">{text}</span>
          ))}
        </div>
      </div>

      {/* Section 01 - THE NUMBERS */}
      <section id="audience" className="py-32 px-6 bg-[#0A0A0A]" data-testid="section-numbers">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{settings.statsSection.eyebrow}</h3>
              <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1] mb-8">{settings.statsSection.headline}</h2>
            </div>
            <div className="flex items-end pb-4">
              <p className="font-sans text-xl md:text-2xl text-[#F4F1EA]/70 leading-relaxed font-medium">
                {settings.statsSection.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((s: Stat, i) => (
              <StatBandItem key={s.id} end={s.value} suffix={s.suffix} label={s.label} desc={s.description} delay={i * 150} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 02 - THE ENGINE (YouTube) */}
      <section id="youtube" className="py-32 px-6 bg-[#0A0A0A] border-t border-[#F4F1EA]/10" data-testid="section-youtube">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{settings.youtubeSection.eyebrow}</h3>
              <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">{settings.youtubeSection.headline}</h2>
            </div>
            <YouTubeCountUp counter={settings.youtubeCounter} />
          </div>

          {/* Hero YouTube video */}
          {heroVideo && (
            <div className="mb-6">
              <VideoCard video={heroVideo} featured />
            </div>
          )}

          {/* More videos, 16:9 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {gridVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>

          {/* Shorts carousel */}
          <div className="flex items-end justify-between mb-8 gap-4">
            <h3 className="font-display text-3xl md:text-4xl">Shorts that hit.</h3>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#F4F1EA]/40 uppercase hidden md:block whitespace-nowrap">
              Hover near an edge to scroll →
            </span>
          </div>
          <ShortsCarousel shorts={shorts} />
        </div>
      </section>

      {/* Section 03 - THE NETWORK */}
      <section id="channels" className="py-32 px-6 bg-[#0A0A0A] border-t border-[#F4F1EA]/10" data-testid="section-channels">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{settings.networkSection.eyebrow}</h3>
              <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">{settings.networkSection.headline}</h2>
            </div>
            <p className="font-sans text-xl text-[#F4F1EA]/70 leading-relaxed font-medium md:pb-3">
              {settings.networkSection.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {platforms.map((p, i) => (
              <PlatformCard key={p.id} p={p} i={i} />
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
            <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{settings.demographicsSection.eyebrow}</h3>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1] max-w-[800px]">{settings.demographicsSection.headline}</h2>
          </div>

          <DemographicsTabs demographics={demographics} settings={settings} />
        </div>
      </section>

      {/* Partner CTA */}
      <section id="partner" className="py-32 px-6 bg-[#E13B2C] text-white text-center" data-testid="section-partner-cta">
        <div className="max-w-[1000px] mx-auto">
          <h3 className="font-mono font-bold text-xs tracking-[0.3em] mb-8 text-white/90">{settings.partnerSection.eyebrow}</h3>
          <h2 className="font-display text-[clamp(48px,8vw,88px)] leading-[1] mb-8 drop-shadow-md">{settings.partnerSection.headline}</h2>
          <p className="font-sans text-xl md:text-2xl font-medium max-w-[800px] mx-auto mb-16 opacity-90">
            {settings.partnerSection.subcopy}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24">
            <a
              href={`mailto:${settings.partnerSection.email}`}
              className="bg-[#0A0A0A] text-white font-display text-lg px-8 py-5 rounded-[3px] hover:bg-white hover:text-[#0A0A0A] transition-colors w-full sm:w-auto text-center"
            >
              START A PARTNERSHIP →
            </a>
            <a
              href={settings.partnerSection.mediaKitUrl}
              className="bg-transparent border-2 border-white/30 text-white font-display text-lg px-8 py-5 rounded-[3px] hover:bg-white hover:text-[#E13B2C] transition-colors w-full sm:w-auto text-center"
            >
              DOWNLOAD MEDIA KIT
            </a>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest opacity-60 mb-10 uppercase">{settings.partnerSection.brandsLogline}</div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              {brands.map((brand, i) => (
                <button
                  key={brand.id}
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
                    src={resolveImg(brand.logoUrl)}
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
            <div className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{activeJobs.length} ROLES OPEN · NOW HIRING</div>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">{settings.careersSection.headline}</h2>
          </div>
          <div>
            <p className="font-sans text-xl text-[#F4F1EA]/70 mb-8 max-w-[600px]">
              {settings.careersSection.body}
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

      <BrandModal brand={activeBrand} onClose={() => setActiveBrand(null)} logline="READY TO BUILD YOUR CAMPAIGN?" />
    </div>
  );
}
