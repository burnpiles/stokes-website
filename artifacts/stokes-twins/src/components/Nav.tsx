import React from "react";
import { Link } from "wouter";
import { Wordmark } from "./Wordmark";
import { useContent } from "@/lib/content";

interface NavProps {
  isCareers?: boolean;
}

export function Nav({ isCareers = false }: NavProps) {
  const { settings } = useContent();
  const vis = settings.sectionVisibility;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/66 backdrop-blur-[14px] border-b border-[#F4F1EA]/10">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity" data-testid="nav-wordmark">
          <Wordmark size="sm" className="!text-[24px]" />
        </Link>

        {!isCareers ? (
          <>
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'NUMBERS', href: '#audience', show: vis?.numbers ?? true },
                { label: 'YOUTUBE', href: '#youtube', show: vis?.youtube ?? true },
                { label: 'CHANNELS', href: '#channels', show: vis?.channels ?? true },
                { label: 'AUDIENCE', href: '#demographics', show: vis?.demographics ?? true },
                { label: 'CAREERS', href: '/careers', show: true },
              ].filter(link => link.show).map(link =>
                link.href.startsWith('/') ? (
                  <Link 
                    key={link.label} 
                    href={link.href}
                    className="font-mono font-semibold text-[12px] tracking-[0.12em] text-[#F4F1EA]/72 hover:text-[#E13B2C] transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a 
                    key={link.label} 
                    href={link.href}
                    className="font-mono font-semibold text-[12px] tracking-[0.12em] text-[#F4F1EA]/72 hover:text-[#E13B2C] transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            {(vis?.partner ?? true) && (
              <a 
                href="#partner" 
                className="bg-[#E13B2C] text-white font-mono font-bold text-[12px] tracking-[0.08em] px-[18px] py-[11px] rounded-[3px] flex items-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors"
                data-testid="nav-partner-cta"
              >
                PARTNER WITH US
                <span className="inline-block w-2 h-2 bg-current" style={{ clipPath: "polygon(0 0, 0 100%, 100% 50%)" }}></span>
              </a>
            )}
          </>
        ) : (
          <div className="flex items-center">
            <Link 
              href="/"
              className="font-mono font-semibold text-[12px] tracking-[0.12em] text-[#F4F1EA]/72 hover:text-[#E13B2C] transition-colors flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 bg-current rotate-180" style={{ clipPath: "polygon(0 0, 0 100%, 100% 50%)" }}></span>
              BACK TO SITE
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
