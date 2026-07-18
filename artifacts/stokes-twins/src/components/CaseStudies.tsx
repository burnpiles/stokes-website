import React, { useCallback, useEffect, useRef, useState } from "react";
import { extractYouTubeId, youtubeThumb } from "@/lib/youtube";
import hktbLogo from "@assets/hktb-logo-banner-transparent_1784348105452.png";
import adobeLogo from "@assets/adobe-firefly-banner-transparent_1784348105452.png";

type StatBlock = { value: string; label: string; qualitative?: boolean };
type MediaLink = { label: string; url: string };

type CaseStudy = {
  client: string;
  logo: { src: string; alt: string };
  headline: string;
  stats: StatBlock[];
  summary: string[];
  featuredLabel: string;
  featuredTitle: string;
  featuredCopy?: string;
  videoUrl: string;
  videoStart?: number;
  highlights?: string[];
  mediaLinks?: MediaLink[];
  footnote?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    client: "HONG KONG TOURISM BOARD",
    logo: { src: hktbLogo, alt: "Hong Kong Tourism Board" },
    headline: "Positioning Hong Kong as a Global Vacation Destination",
    stats: [
      { value: "100M+", label: "Views across platforms" },
      { value: "1B+", label: "Total impressions" },
    ],
    summary: [
      "Hong Kong Tourism Board partnered with the Stokes Twins to show a global audience that Hong Kong is more than an international business center—it is also an unforgettable vacation destination.",
      "By giving the Stokes Twins creative freedom, the partnership became an entertainment-led travel campaign that generated more than 100 million views and one billion impressions across platforms.",
    ],
    featuredLabel: "FEATURED CONTENT",
    featuredTitle: "\u201cSurprising Twin Brother With Dream Vacation\u201d",
    videoUrl: "https://www.youtube.com/watch?v=uKHKUyua9OE",
    highlights: [
      "Exclusive access to a Hong Kong water park",
      "Football and challenges at Kai Tak Sports Park",
      "Giant pandas, penguins, and Ocean Park experiences",
      "A VIP Hong Kong Disneyland finale",
    ],
    footnote: "Views and impressions reflect combined performance across multiple platforms.",
  },
  {
    client: "ADOBE FIREFLY",
    logo: { src: adobeLogo, alt: "Adobe Firefly" },
    headline: "Bringing Adobe Firefly to a New Global Audience Through Entertainment",
    stats: [
      { value: "500M+", label: "Campaign impressions" },
      { value: "NEW GLOBAL AUDIENCE", label: "Expanded Firefly beyond Adobe\u2019s existing customer base", qualitative: true },
    ],
    summary: [
      "The Stokes Twins used their storytelling expertise to introduce Adobe Firefly\u2014Adobe\u2019s generative AI platform\u2014not only to Adobe\u2019s existing customers, but also to an entirely new global audience.",
      "The partnership transformed a traditional product launch into engaging, entertainment-led content that audiences actively chose to watch and continued engaging with afterward.",
    ],
    featuredLabel: "FEATURED INTEGRATION",
    featuredTitle: "I Became Principal at the World\u2019s Strictest School",
    featuredCopy:
      "Adobe Firefly was integrated naturally into the Stokes Twins\u2019 main-channel storytelling, demonstrating the platform through entertainment rather than a traditional product demonstration.",
    videoUrl: "https://youtu.be/LJYkuCoTOKg?si=t70t4svJ8CUOHsw1&t=685",
    videoStart: 685,
    mediaLinks: [
      { label: "WATCH ON TIKTOK", url: "https://www.tiktok.com/@stokestwins/video/7633495295602527502" },
      { label: "WATCH ON YOUTUBE SHORTS", url: "https://www.youtube.com/shorts/oT0YAym1ZjM" },
    ],
  },
];

function CaseVideo({ url, title, start, active }: { url: string; title: string; start?: number; active: boolean }) {
  const ytId = extractYouTubeId(url);
  const [playing, setPlaying] = useState(false);

  // Pause (unmount) playback when the slide changes.
  useEffect(() => {
    if (!active) setPlaying(false);
  }, [active]);

  if (!ytId) return null;
  const startParam = start ? `&start=${start}` : "";
  return (
    <div className="relative aspect-video rounded-[8px] overflow-hidden bg-[#0A0A0A] border border-[#0A0A0A]/10">
      {playing && active ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1${startParam}`}
          title={title}
          allow="accelerated-display; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          data-testid="case-study-iframe"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 w-full h-full"
          aria-label={`Play video: ${title}`}
          data-testid="case-study-video-thumb"
        >
          <img
            src={youtubeThumb(url, "max")}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.fallback !== "1") {
                img.dataset.fallback = "1";
                img.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
              }
            }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth <= 120 && img.dataset.fallback !== "1") {
                img.dataset.fallback = "1";
                img.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 rounded-full bg-[#E13B2C] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#F4F1EA] ml-1" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

export function CaseStudies() {
  const [index, setIndex] = useState(0);
  const total = CASE_STUDIES.length;
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
  };

  const cs = CASE_STUDIES[index];

  return (
    <div className="mt-16 md:mt-24" data-testid="case-studies">
      <div className="mb-8 md:mb-12">
        <h3 className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-4">CASE STUDIES</h3>
        <p className="font-sans text-lg md:text-xl text-[#0A0A0A]/70 max-w-[600px]">
          Selected partnerships that delivered measurable global impact.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {CASE_STUDIES.map((s, i) => (
          <button
            key={s.client}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show case study ${i + 1}: ${s.client}`}
            aria-current={i === index}
            data-testid={`case-study-tab-${i}`}
            className={`font-mono text-[11px] tracking-[0.15em] px-4 py-2 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E13B2C] ${
              i === index
                ? "bg-[#0A0A0A] text-[#F4F1EA] border-[#0A0A0A]"
                : "bg-transparent text-[#0A0A0A]/60 border-[#0A0A0A]/20 hover:text-[#0A0A0A] hover:border-[#0A0A0A]/50"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {s.client}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous case study"
            data-testid="case-study-prev"
            className="w-10 h-10 rounded-full border border-[#0A0A0A]/20 flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F4F1EA] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E13B2C]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next case study"
            data-testid="case-study-next"
            className="w-10 h-10 rounded-full border border-[#0A0A0A]/20 flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F4F1EA] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E13B2C]"
          >
            →
          </button>
        </div>
      </div>

      {/* Slide */}
      <div
        ref={regionRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Case studies"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const startX = touchStartX.current;
          touchStartX.current = null;
          if (startX === null) return;
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) > 50) go(dx < 0 ? index + 1 : index - 1);
        }}
        className="bg-white rounded-[12px] border border-[#0A0A0A]/10 p-6 md:p-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E13B2C] overflow-hidden"
        data-testid="case-study-slide"
      >
        <div key={index} className="grid md:grid-cols-[1fr_360px] gap-10 md:gap-14 motion-safe:animate-[fadeIn_0.4s_ease]">
          {/* Left column */}
          <div className="order-2 md:order-1 min-w-0">
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#0A0A0A]/50 mb-3">{cs.client}</div>
            <h4 className="font-display text-[28px] md:text-[40px] leading-[1.1] mb-6">{cs.headline}</h4>
            {cs.summary.map((p) => (
              <p key={p.slice(0, 40)} className="font-sans text-base md:text-lg text-[#0A0A0A]/70 mb-4 max-w-[640px]">{p}</p>
            ))}
            <div className="mt-8">
              <div className="font-mono text-[11px] tracking-[0.3em] text-[#E13B2C] font-bold mb-2">{cs.featuredLabel}</div>
              <div className="font-display text-lg md:text-xl mb-4">{cs.featuredTitle}</div>
              {cs.featuredCopy && (
                <p className="font-sans text-sm md:text-base text-[#0A0A0A]/70 mb-4 max-w-[640px]">{cs.featuredCopy}</p>
              )}
              <CaseVideo url={cs.videoUrl} title={cs.featuredTitle} start={cs.videoStart} active={true} />
            </div>
            {cs.highlights && (
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                {cs.highlights.map((h) => (
                  <li key={h} className="font-sans text-sm text-[#0A0A0A]/70 flex gap-2">
                    <span className="text-[#E13B2C] flex-none">—</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
            {cs.mediaLinks && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {cs.mediaLinks.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`case-study-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group flex items-center justify-between gap-4 flex-1 border border-[#0A0A0A]/15 rounded-[8px] px-5 py-4 hover:border-[#E13B2C] transition-colors"
                  >
                    <span className="font-mono text-[11px] tracking-[0.15em] font-bold">{l.label}</span>
                    <span className="text-[#E13B2C] group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                ))}
              </div>
            )}
            {cs.footnote && (
              <p className="mt-6 font-mono text-[10px] tracking-[0.1em] text-[#0A0A0A]/40 uppercase">{cs.footnote}</p>
            )}
          </div>

          {/* Right column: brand logo + stats */}
          <div className="order-1 md:order-2 flex flex-col">
            <div className="mb-6 md:mb-8">
              <img
                src={cs.logo.src}
                alt={cs.logo.alt}
                loading="lazy"
                className="w-auto max-w-[240px] md:max-w-[300px] max-h-[72px] md:max-h-[96px] object-contain object-left"
                data-testid={`case-study-logo-${index}`}
              />
            </div>
            {cs.stats.map((s, i) => (
              <div
                key={s.value + s.label}
                className={`py-5 md:py-6 ${i < cs.stats.length - 1 ? "border-b border-[#E13B2C]" : ""} ${i === 0 ? "pt-0 md:pt-0" : ""}`}
              >
                <div
                  className={`font-display text-[#E13B2C] ${s.qualitative ? "leading-[1.05] text-[28px] md:text-[34px]" : "leading-none text-[40px] md:text-[52px]"}`}
                >
                  {s.value}
                </div>
                <div className="font-sans text-sm text-[#0A0A0A]/60 mt-2 max-w-[280px]">{s.label}</div>
              </div>
            ))}
            <div className="hidden md:block mt-auto pt-8 font-mono text-[11px] tracking-[0.2em] text-[#0A0A0A]/40">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
