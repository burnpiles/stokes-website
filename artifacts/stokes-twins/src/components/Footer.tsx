import React from "react";
import { Link } from "wouter";
import { Wordmark } from "./Wordmark";
import { useContent } from "@/lib/content";

export function Footer() {
  const { settings } = useContent();
  return (
    <footer className="bg-[#070707] py-20 px-6 border-t border-[#F4F1EA]/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <Wordmark size="lg" className="mb-4" />
            <p className="font-mono text-sm text-[#F4F1EA]/50 tracking-wide">
              {settings.footer.description}
            </p>
          </div>
          
          <div>
            <h4 className="font-mono font-bold text-xs tracking-widest text-[#F4F1EA] mb-6">NETWORK</h4>
            <ul className="space-y-4 font-mono text-sm text-[#F4F1EA]/60">
              <li><Link href="/" className="hover:text-[#E13B2C] transition-colors">Stokes Twins</Link></li>
              <li><Link href="/" className="hover:text-[#E13B2C] transition-colors">Alan & Alex Stokes</Link></li>
              <li><Link href="/" className="hover:text-[#E13B2C] transition-colors">More Channels</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono font-bold text-xs tracking-widest text-[#F4F1EA] mb-6">COMPANY</h4>
            <ul className="space-y-4 font-mono text-sm text-[#F4F1EA]/60">
              <li><Link href="/#work" className="hover:text-[#E13B2C] transition-colors">Media Kit</Link></li>
              <li><Link href="/careers" className="hover:text-[#E13B2C] transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-[#E13B2C] transition-colors">Privacy Policy</Link></li>
            </ul>
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
