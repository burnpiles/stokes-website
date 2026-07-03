import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Wordmark } from "@/components/Wordmark";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useCountUp } from "@/hooks/useCountUp";
import { useReveal } from "@/hooks/useReveal";
import { useBarGrow } from "@/hooks/useBarGrow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useContent } from "@/lib/content";
import { resolveImg } from "@/lib/resolveImg";
import { extractYouTubeId, youtubeThumb } from "@/lib/youtube";
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

function PlayHeadline({ text }: { text: string }) {
  const match = text.match(/play/i);
  if (!match || match.index === undefined) return <>{text}</>;
  const start = match.index;
  const end = start + match[0].length;
  return (
    <>
      {text.slice(0, start)}
      <span className="relative inline-block text-[#0A0A0A] origin-bottom animate-[playPulse_2.4s_cubic-bezier(0.34,1.56,0.64,1)_infinite]">
        {text.slice(start, end)}
        <span className="absolute left-0 -bottom-1 h-[6px] w-full origin-left rounded-full bg-[#0A0A0A] animate-[playUnderline_2.4s_ease-in-out_infinite]" />
      </span>
      {text.slice(end)}
    </>
  );
}

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

const UNIT_MULTIPLIER: Record<string, number> = { B: 1e9, M: 1e6, K: 1e3 };

function parseStatSuffix(suffix: string): { multiplier: number; plus: string } {
  const unit = (suffix.match(/[KMB]/i)?.[0] ?? "").toUpperCase();
  const plus = suffix.includes("+") ? "+" : "";
  return { multiplier: UNIT_MULTIPLIER[unit] ?? 1, plus };
}

function formatStatValue(n: number, plus: string): string {
  if (n >= 1e9) {
    const b = n / 1e9;
    const s = b >= 100 ? Math.round(b).toString() : (Math.round(b * 10) / 10).toString();
    return `${s}B${plus}`;
  }
  if (n >= 1e6) return `${Math.round(n / 1e6)}M${plus}`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K${plus}`;
  return `${Math.round(n)}${plus}`;
}

function StatBandItem({ end, suffix, label, desc, delay }: { end: number, suffix: string, label: string, desc: string, delay: number }) {
  const { ref, isVisible } = useReveal(delay);
  const isTextStat = end === 0 && suffix.trim() !== "";
  const { multiplier, plus } = parseStatSuffix(suffix);
  const target = isTextStat ? 0 : end * multiplier;
  const count = useCountUp(isVisible ? target : 0, 2200);

  return (
    <div ref={ref} className={`border-t-2 border-[#E13B2C] pt-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-[36px] md:text-[56px] font-display text-[#F4F1EA] leading-none mb-4 tabular-nums">
        {isTextStat ? suffix : multiplier === 1 ? `${count}${plus}` : formatStatValue(count, plus)}
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

  const subLinks = (p.links ?? []).length > 0 ? (
    <div className="w-full mt-5 pt-4 border-t border-[#F4F1EA]/10 flex flex-col gap-2">
      {(p.links ?? []).map((l, li) => (
        <a
          key={li}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          data-testid={`platform-link-${p.name.toLowerCase()}-${li}`}
          aria-label={`${l.label} on ${p.name}`}
          className="flex items-center justify-between gap-2 bg-[#0A0A0A] border border-[#F4F1EA]/15 rounded-[4px] px-3 py-2 hover:border-[#E13B2C]/60 transition-colors"
        >
          <span className="flex items-center gap-2 min-w-0">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" style={{ color: p.color }} fill="currentColor" aria-hidden="true">
              <path d={platformIcon(p.iconKey)} />
            </svg>
            <span className="font-mono text-[10px] tracking-[0.12em] text-[#F4F1EA]/80 uppercase truncate">{l.label}</span>
          </span>
          <span className="font-display text-sm text-[#F4F1EA] shrink-0">{l.value}</span>
        </a>
      ))}
    </div>
  ) : null;

  if (p.url) {
    return (
      <div ref={ref} className={cardClass}>
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`platform-${p.name.toLowerCase()}`}
          aria-label={`Stokes Twins on ${p.name}`}
          className="flex flex-col items-center w-full"
        >
          {inner}
        </a>
        {subLinks}
      </div>
    );
  }

  return (
    <div ref={ref} className={cardClass}>
      {inner}
      {subLinks}
    </div>
  );
}

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

function DemoPanel({ label, subcopy, className = "", children }: { label: string; subcopy?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative rounded-2xl border border-[#0A0A0A]/10 bg-white/55 backdrop-blur-sm p-7 md:p-9 ${className}`}>
      <div className="flex items-center gap-2.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E13B2C]" />
        <h4 className="font-mono text-[11px] tracking-[0.25em] font-bold text-[#0A0A0A]/70">{label}</h4>
      </div>
      {subcopy && <p className="font-sans text-[15px] text-[#0A0A0A]/55 leading-relaxed mb-8 max-w-[440px]">{subcopy}</p>}
      <div className={subcopy ? "" : "mt-7"}>{children}</div>
    </div>
  );
}

function DemographicsPanel({ demographics, settings }: { demographics: Demographic[]; settings: Settings }) {
  const byCat = (cat: string) =>
    demographics.filter((d) => d.category === cat).sort((a, b) => a.sortOrder - b.sortOrder);
  const age = byCat("age");
  const gender = byCat("gender");
  const geo = byCat("geography");
  const geoMax = Math.max(...geo.map((g) => g.percent), 1);
  const demoCopy = settings.demographicsSection;
  const eng = settings.engagement;

  return (
    <div className="space-y-6">
      {/* Row 1 — Age + Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DemoPanel label="AGE" subcopy={demoCopy.ageSubcopy} className="lg:col-span-7">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${age.length || 1}, minmax(0, 1fr))` }}>
            {age.map((d, i) => (
              <VBarLight key={d.id} label={d.label} percent={d.percent} peak={d.highlight} delay={i * 80} />
            ))}
          </div>
        </DemoPanel>

        <DemoPanel label="GENDER" subcopy={demoCopy.genderSubcopy} className="lg:col-span-5">
          <div className="space-y-7">
            {gender.map((d, i) => (
              <GenderBar key={d.id} label={d.label} percent={d.percent} color={GENDER_COLORS[i] ?? "#9C9488"} delay={i * 120} />
            ))}
          </div>
        </DemoPanel>
      </div>

      {/* Row 2 — Geography + Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DemoPanel label="GEOGRAPHY" subcopy={demoCopy.geographySubcopy} className="lg:col-span-5">
          <div className="space-y-6">
            {geo.map((d, i) => (
              <HBar key={d.id} label={d.label} percent={d.percent} max={geoMax} accent={d.percent === geoMax} delay={i * 100} />
            ))}
          </div>
        </DemoPanel>

        <DemoPanel label="ENGAGEMENT" className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center sm:justify-start">
              <RetentionRing percent={eng.avgRetention} delay={0} />
            </div>
            <div className="grid grid-cols-1 gap-6">
              <MetricCard value={eng.likes} label="LIKES / VIDEO" delay={120} />
              <MetricCard value={eng.comments} label="COMMENTS / VIDEO" delay={240} />
              <MetricCard value={eng.shares} label="SHARES / VIDEO" delay={360} />
            </div>
          </div>
        </DemoPanel>
      </div>
    </div>
  );
}

function liveYouTubeCount(c: Settings["youtubeCounter"]): number {
  const anchor = Date.parse(c.anchorIso);
  const minutes = Math.max(0, (Date.now() - anchor) / 60_000);
  return Math.min(c.target, Math.floor(c.base + minutes * c.perMinute));
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
      <div className="font-mono text-xs tracking-[0.2em] text-[#F4F1EA]/60 uppercase mt-3 mb-3 md:mt-0">
        {counter.subLabel}
      </div>
      <div className="font-display text-[#E13B2C] text-[40px] md:text-[64px] leading-none md:leading-[1.1] tabular-nums">
        {count.toLocaleString()}
      </div>
    </div>
  );
}

function VideoCard({ video, featured = false }: { video: Video; featured?: boolean }) {
  const ytId = extractYouTubeId(video.youtubeUrl);
  const override = video.thumbnailUrl.trim();
  const src = override ? resolveImg(override) : youtubeThumb(video.youtubeUrl, "max");
  const [playing, setPlaying] = useState(false);
  const canPlay = ytId !== "";
  return (
    <div className="group relative rounded-[6px] overflow-hidden bg-[#141210] border border-[#F4F1EA]/10 hover:border-[#E13B2C]/50 transition-colors duration-300">
      <div className="relative aspect-video overflow-hidden">
        {playing && canPlay ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerated-display; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            data-testid="video-iframe"
          />
        ) : (
          <>
            <img
              src={src}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const img = e.currentTarget;
                if (!override && ytId && img.dataset.fallback !== "1") {
                  img.dataset.fallback = "1";
                  img.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/10 to-transparent" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[80%]">
              {video.tags.map((t) => (
                <span key={t} className="font-mono text-[10px] tracking-widest uppercase bg-[#0A0A0A]/70 backdrop-blur-sm border border-white/15 px-2.5 py-1 rounded-full text-[#F4F1EA]">
                  {t}
                </span>
              ))}
            </div>
            {video.duration.trim() && (
              <div className="absolute bottom-3 right-3 font-mono text-[11px] bg-[#0A0A0A]/85 px-2 py-0.5 rounded text-[#F4F1EA]">
                {video.duration}
              </div>
            )}
            <button
              type="button"
              onClick={() => canPlay && setPlaying(true)}
              disabled={!canPlay}
              aria-label={canPlay ? `Play ${video.title}` : video.title}
              className="absolute inset-0 flex items-center justify-center disabled:cursor-default"
              data-testid="video-play"
            >
              <span className={`${featured ? "w-14 h-14 md:w-20 md:h-20" : "w-14 h-14"} rounded-full bg-[#E13B2C] flex items-center justify-center scale-90 opacity-85 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_30px_rgba(225,59,44,0.5)]`}>
                <svg viewBox="0 0 24 24" className={`${featured ? "w-5 h-5 md:w-8 md:h-8" : "w-5 h-5"} fill-white ml-1`}><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          </>
        )}
      </div>
      <div className={featured ? "p-5 md:p-7" : "p-5"}>
        <h4 className={`font-display ${featured ? "text-lg md:text-[34px]" : "text-lg"} leading-tight mb-2`}>{video.title}</h4>
        {video.views.trim() && <div className="font-mono text-xs text-[#F4F1EA]/50 tracking-wide">{video.views} VIEWS</div>}
      </div>
    </div>
  );
}

function ShortCard({ short: s }: { short: Short }) {
  const ytId = extractYouTubeId(s.youtubeUrl);
  const override = s.thumbnailUrl.trim();
  const src = override ? resolveImg(override) : youtubeThumb(s.youtubeUrl, "max");
  const [playing, setPlaying] = useState(false);
  const canPlay = ytId !== "";
  return (
    <div className="group relative shrink-0 w-[190px] md:w-[230px] aspect-[9/16] rounded-[8px] overflow-hidden bg-[#141210] border border-[#F4F1EA]/10">
      {playing && canPlay ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={s.title}
          allow="accelerated-display; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          data-testid="short-iframe"
        />
      ) : (
        <>
          <img
            src={src}
            alt={s.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget;
              if (!override && ytId && img.dataset.fallback !== "1") {
                img.dataset.fallback = "1";
                img.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/10" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#0A0A0A]/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#E13B2C]"><path d="M8 5v14l11-7z" /></svg>
            <span className="font-mono text-[9px] tracking-widest text-white/85 uppercase">Short</span>
          </div>
          <button
            type="button"
            onClick={() => canPlay && setPlaying(true)}
            disabled={!canPlay}
            aria-label={canPlay ? `Play ${s.title}` : s.title}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:cursor-default"
            data-testid="short-play"
          >
            <span className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4">
            <div className="font-sans font-bold text-sm text-white leading-tight mb-1 line-clamp-2">{s.title}</div>
            {s.views.trim() && <div className="font-mono text-[10px] text-[#F4F1EA]/60">{s.views} views</div>}
          </div>
        </>
      )}
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
          <ShortCard key={s.id} short={s} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent" />
    </div>
  );
}

export default function LandingPage() {
  const content = useContent();
  const { settings, stats, platforms, videos, shorts, demographics, brands, press, jobs } = content;
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

        {/* Background Video */}
        <BackgroundVideo base="image5" className="absolute inset-0 z-0" overlayClassName="absolute inset-0 bg-[#0A0A0A]/45" />

        {/* Animated Gradient */}
        <div
          className="absolute inset-0 z-0 animate-drift opacity-45 mix-blend-overlay"
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
          <div className="animate-rise mb-8">
            <span className="inline-block font-mono font-bold text-[#E13B2C] text-[12px] tracking-[0.4em] bg-[#0A0A0A]/80 rounded-full px-5 py-2.5">
              {settings.hero.eyebrow}
            </span>
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

          {(() => {
            const anchorVisibility: Record<string, boolean | undefined> = {
              "#audience": settings.sectionVisibility?.numbers,
              "#youtube": settings.sectionVisibility?.youtube,
              "#channels": settings.sectionVisibility?.channels,
              "#demographics": settings.sectionVisibility?.demographics,
              "#partner": settings.sectionVisibility?.partner,
              "#press": settings.sectionVisibility?.press,
            };
            const targetVisible = anchorVisibility[settings.hero.ctaHref] ?? true;
            return targetVisible ? (
              <a
                href={settings.hero.ctaHref}
                className="animate-rise bg-white text-[#0A0A0A] font-display text-[17px] px-[34px] py-[18px] rounded-[3px] hover:bg-[#E13B2C] hover:text-white transition-colors"
                style={{ animationDelay: '0.4s' }}
                data-testid="hero-cta-btn"
              >
                {settings.hero.ctaLabel}
              </a>
            ) : null;
          })()}
        </div>
      </section>

      {/* Marquee */}
      <div className="border-t border-[#E13B2C] bg-[#0A0A0A] overflow-hidden py-4">
        <div className="whitespace-nowrap flex w-[200%] animate-marq">
          {Array(4).fill(0).map((_, copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {settings.marqueeText.split("·").map((w) => w.trim()).filter(Boolean).map((word, j) => (
                <span key={j} className="flex items-center font-display text-2xl md:text-3xl text-[#F4F1EA]/20">
                  {word}
                  <span className="mx-4 md:mx-6">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Section 01 - THE NUMBERS */}
      {(settings.sectionVisibility?.numbers ?? true) && (
      <section id="audience" className="py-20 md:py-32 px-6 bg-[#0A0A0A]" data-testid="section-numbers">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 mb-12 md:mb-24">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-4 md:mb-6">{settings.statsSection.eyebrow}</h3>
              <h2 className="font-display text-[40px] md:text-[64px] leading-[1.1]">{settings.statsSection.headline}</h2>
            </div>
            <div>
              <h3 className="font-mono text-sm tracking-[0.2em] font-bold mb-6 invisible select-none hidden md:block" aria-hidden="true">{settings.statsSection.eyebrow}</h3>
              <p className="font-sans text-xl md:text-2xl text-[#F4F1EA]/70 leading-relaxed font-medium">
                {settings.statsSection.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {stats.map((s: Stat, i) => (
              <StatBandItem key={s.id} end={s.value} suffix={s.suffix} label={s.label} desc={s.description} delay={i * 60} />
            ))}
          </div>
          {stats.some((s: Stat) => s.label.includes("*")) && (
            <div className="mt-10 font-mono text-xs tracking-widest text-[#F4F1EA]/40" data-testid="stats-footnote">*LIFETIME</div>
          )}
        </div>
      </section>
      )}

      {/* Section 02 - THE ENGINE (YouTube) */}
      {(settings.sectionVisibility?.youtube ?? true) && (
      <section id="youtube" className="py-20 md:py-32 px-6 bg-[#0A0A0A] border-t border-[#F4F1EA]/10" data-testid="section-youtube">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 md:gap-12 items-end mb-8 md:mb-16">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{settings.youtubeSection.eyebrow}</h3>
              <h2 className="font-display text-[44px] md:text-[clamp(2.5rem,4vw,3.75rem)] leading-[1.1] lg:whitespace-nowrap">{settings.youtubeSection.headline}</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-24">
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
      )}

      {/* Section 03 - THE NETWORK */}
      {(settings.sectionVisibility?.channels ?? true) && (
      <section id="channels" className="relative overflow-hidden py-20 md:py-32 px-6 bg-[#0A0A0A] border-t border-[#F4F1EA]/10" data-testid="section-channels">
        <BackgroundVideo base="image23" className="absolute inset-0 z-0" overlayClassName="absolute inset-0 bg-[#0A0A0A]/80" />
        <div className="relative z-10 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 md:gap-12 items-end mb-8 md:mb-16">
            <div>
              <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{settings.networkSection.eyebrow}</h3>
              <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1]">
                {settings.networkSection.headline.split(", ").map((part, idx, arr) => (
                  <span key={idx} className="block whitespace-nowrap">
                    {part}
                    {idx < arr.length - 1 ? "," : ""}
                  </span>
                ))}
              </h2>
            </div>
            <p className="font-sans text-xl text-[#F4F1EA]/70 leading-relaxed font-medium md:pb-3">
              {settings.networkSection.description}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {platforms.map((p, i) => (
              <PlatformCard key={p.id} p={p} i={i} />
            ))}

            {/* More to come — sits in the grid, to the right of the platforms */}
            <div
              className="group relative overflow-hidden bg-gradient-to-br from-[#141210] to-[#17100e] border border-dashed border-[#E13B2C]/30 rounded-[6px] p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[180px] transition-colors duration-500 hover:border-[#E13B2C]/60"
              data-testid="more-to-come"
            >
              <div className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] text-[#F4F1EA]/40 mb-4 animate-pulse">EXPANDING</div>
              <h3
                className="font-display text-[30px] md:text-[34px] leading-[1.05] bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(110deg, rgba(244,241,234,0.55) 30%, #FFFFFF 47%, #E13B2C 50%, #FFFFFF 53%, rgba(244,241,234,0.55) 70%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 5s linear infinite",
                }}
              >
                More to come
              </h3>
              <div className="flex justify-center gap-2 mt-5">
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
        </div>
      </section>
      )}

      {/* Section 04 - WHO'S WATCHING */}
      {(settings.sectionVisibility?.demographics ?? true) && (
      <section id="demographics" className="py-20 md:py-32 px-6 bg-[#F4F1EA] text-[#0A0A0A]" data-testid="section-demographics">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-10 md:mb-16">
            <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{settings.demographicsSection.eyebrow}</h3>
            <h2 className="font-display text-[48px] md:text-[64px] leading-[1.1] max-w-[800px]">{settings.demographicsSection.headline}</h2>
          </div>

          <DemographicsPanel demographics={demographics} settings={settings} />
        </div>
      </section>
      )}

      {/* Partner CTA */}
      {(settings.sectionVisibility?.partner ?? true) && (
      <section id="partner" className="py-20 md:py-32 px-6 bg-[#E13B2C] text-white text-center" data-testid="section-partner-cta">
        <div className="max-w-[1000px] mx-auto">
          <h3 className="font-mono font-bold text-xs tracking-[0.3em] mb-8 text-white/90">{settings.partnerSection.eyebrow}</h3>
          <h2 className="font-display text-[clamp(48px,8vw,88px)] leading-[1] mb-8 drop-shadow-md">
            <PlayHeadline text={settings.partnerSection.headline} />
          </h2>
          <p className="font-sans text-xl md:text-2xl font-medium max-w-[800px] mx-auto mb-10 md:mb-16 opacity-90">
            {settings.partnerSection.subcopy}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 md:mb-24">
            <a
              href={`mailto:${settings.partnerSection.email}`}
              className="bg-[#0A0A0A] text-white font-display text-lg px-8 py-5 rounded-[3px] hover:bg-white hover:text-[#0A0A0A] transition-colors w-full sm:w-auto text-center"
            >
              START A PARTNERSHIP →
            </a>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-widest opacity-60 mb-10 uppercase">{settings.partnerSection.brandsLogline}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 max-w-[760px] mx-auto justify-items-center">
              {brands.map((brand, i) => {
                const interactive = settings.partnerSection.showBrandModal;
                return (
                  <button
                    key={brand.id}
                    onClick={interactive ? () => setActiveBrand(brand) : undefined}
                    disabled={!interactive}
                    data-testid={`brand-logo-${brand.name.toLowerCase().replace(/[^a-z]/g, '')}`}
                    title={interactive ? `View ${brand.name} partnership stats` : brand.name}
                    className={`group relative w-full max-w-[160px] aspect-square rounded-[6px] overflow-hidden ${interactive ? "cursor-pointer" : "cursor-default"}`}
                    style={{
                      animation: `brandReveal 0.6s cubic-bezier(0.16,1,0.3,1) both`,
                      animationDelay: `${0.1 + i * 0.12}s`,
                    }}
                  >
                    <img
                      src={resolveImg(brand.logoUrl)}
                      alt={brand.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ease-out ${interactive ? "group-hover:scale-110" : ""}`}
                    />
                    {interactive && (
                      <>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-[6px]" />
                        <div className="absolute inset-0 rounded-[6px] ring-0 group-hover:ring-2 group-hover:ring-white/40 transition-all duration-300" />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            {settings.partnerSection.showBrandModal && (
              <div className="mt-6 font-mono text-[10px] tracking-[0.2em] opacity-40 uppercase">Click a logo to see campaign results</div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Section 06 - IN THE PRESS */}
      {(settings.sectionVisibility?.press ?? true) && press.length > 0 && (
      <section id="press" className="py-20 md:py-32 px-6 bg-[#0A0A0A] border-t border-[#F4F1EA]/10" data-testid="section-press">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12 md:mb-20">
            <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-4 md:mb-6">{settings.pressSection?.eyebrow}</h3>
            <h2 className="font-display text-[40px] md:text-[64px] leading-[1.1]">{settings.pressSection?.headline}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {press.map((item, i) => (
              <a
                key={item.id}
                href={item.url || undefined}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`press-card-${item.id}`}
                className="group block bg-[#141210] border border-[#F4F1EA]/10 rounded-[6px] overflow-hidden hover:border-[#E13B2C]/60 transition-colors"
                style={{
                  animation: `brandReveal 0.6s cubic-bezier(0.16,1,0.3,1) both`,
                  animationDelay: `${0.1 + i * 0.1}s`,
                }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={resolveImg(item.imageUrl)}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#E13B2C] uppercase mb-3">{item.outlet}</div>
                  <div className="font-display text-xl md:text-2xl leading-[1.15] group-hover:text-[#E13B2C] transition-colors">{item.title}</div>
                  <div className="mt-4 font-mono text-[10px] tracking-[0.18em] text-[#F4F1EA]/40 uppercase flex items-center gap-2">
                    Read the story
                    <span className="text-[#E13B2C] group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Careers Teaser */}
      {(settings.sectionVisibility?.careers ?? true) && (
      <section className="py-20 md:py-32 px-6 bg-[#141210] border-t border-[#F4F1EA]/10" data-testid="section-careers-teaser">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
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
      )}

      <Footer />

      <BrandModal brand={activeBrand} onClose={() => setActiveBrand(null)} logline="READY TO BUILD YOUR CAMPAIGN?" />
    </div>
  );
}
