import React from "react";
import { Link } from "wouter";
import { Wordmark } from "./Wordmark";
import { useContent } from "@/lib/content";
import { platformIcon } from "@/lib/platformIcons";

export function Footer() {
  const { settings } = useContent();

  const socials = [
    { key: "youtube", label: "YouTube", url: settings.socials.youtube.url },
    { key: "tiktok", label: "TikTok", url: settings.socials.tiktok.url },
    { key: "instagram", label: "Instagram", url: settings.socials.instagram.url },
  ];

  return (
    <footer className="bg-[#070707] py-16 px-6 border-t border-[#F4F1EA]/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-12">
          {/* Brand */}
          <div>
            <Wordmark size="lg" className="mb-4" />
            <p className="font-mono text-sm text-[#F4F1EA]/50 tracking-wide">
              {settings.footer.description}
            </p>
          </div>

          {/* Links + Socials */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-8">
            <nav className="flex items-center gap-8 font-mono text-sm text-[#F4F1EA]/60">
              <Link href="/careers" className="hover:text-[#E13B2C] transition-colors">Careers</Link>
              <a href="mailto:partnerships@stokestwins.com" className="hover:text-[#E13B2C] transition-colors">Contact Us</a>
              <Link href="/privacy" className="hover:text-[#E13B2C] transition-colors">Privacy Policy</Link>
            </nav>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#F4F1EA]/15 text-[#F4F1EA]/70 hover:text-[#0A0A0A] hover:bg-[#E13B2C] hover:border-[#E13B2C] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[18px] h-[18px]">
                    <path d={platformIcon(s.key)} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#F4F1EA]/10 font-mono text-xs text-[#F4F1EA]/40 tracking-widest">
          <p>{settings.footer.copyright}</p>
          <p className="mt-4 md:mt-0">{settings.footer.slogan}</p>
        </div>
      </div>
    </footer>
  );
}
