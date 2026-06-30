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
    <footer className="bg-[#070707] py-20 px-6 border-t border-[#F4F1EA]/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Brand */}
          <div>
            <Wordmark size="lg" className="mb-4" />
            <p className="font-mono text-sm text-[#F4F1EA]/50 tracking-wide">
              {settings.footer.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono font-bold text-xs tracking-widest text-[#F4F1EA] mb-6">COMPANY</h4>
            <ul className="space-y-4 font-mono text-sm text-[#F4F1EA]/60">
              <li>
                <Link href="/careers" className="hover:text-[#E13B2C] transition-colors">Careers</Link>
              </li>
              <li>
                <a href="mailto:partnerships@stokestwins.com" className="hover:text-[#E13B2C] transition-colors">Contact Us</a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#E13B2C] transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="md:text-right">
            <h4 className="font-mono font-bold text-xs tracking-widest text-[#F4F1EA] mb-6">FOLLOW</h4>
            <div className="flex gap-4 md:justify-end">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-[#F4F1EA]/15 text-[#F4F1EA]/70 hover:text-[#0A0A0A] hover:bg-[#E13B2C] hover:border-[#E13B2C] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
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
