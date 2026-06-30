import React, { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "1. Overview",
    body: [
      "This Privacy Policy describes how Stokes Empire LLC (\u201cStokes Twins\u201d, \u201cwe\u201d, \u201cus\u201d, or \u201cour\u201d) collects, uses, and protects information when you visit our website. By using this site, you agree to the practices described below.",
    ],
  },
  {
    heading: "2. Information We Collect",
    body: [
      "We may collect information you provide directly, such as your name and email address when you contact us about partnerships or careers.",
      "We also collect limited technical information automatically, including your browser type, device information, and pages visited, through standard analytics and server logs.",
    ],
  },
  {
    heading: "3. How We Use Information",
    body: [
      "We use the information we collect to respond to inquiries, evaluate partnership and employment opportunities, operate and improve the site, and maintain its security.",
    ],
  },
  {
    heading: "4. Cookies & Analytics",
    body: [
      "Our site may use cookies and similar technologies to understand how visitors interact with our content. You can control cookies through your browser settings, though some features may not function properly if disabled.",
    ],
  },
  {
    heading: "5. Sharing of Information",
    body: [
      "We do not sell your personal information. We may share information with trusted service providers who help us operate the site, or where required by law.",
    ],
  },
  {
    heading: "6. Data Security",
    body: [
      "We take reasonable measures to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "7. Children\u2019s Privacy",
    body: [
      "This site is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has provided us information, please contact us so we can remove it.",
    ],
  },
  {
    heading: "8. Your Rights",
    body: [
      "Depending on your location, you may have the right to access, correct, or delete your personal information. To make a request, contact us using the details below.",
    ],
  },
  {
    heading: "9. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.",
    ],
  },
  {
    heading: "10. Contact",
    body: [
      "If you have questions about this Privacy Policy, contact us at partnerships@stokestwins.com.",
    ],
  },
];

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | Stokes Twins";
    document.body.style.backgroundColor = "#0A0A0A";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F1EA] overflow-x-hidden pt-20">
      <Nav isCareers={true} />

      <header className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E13B2C]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-[820px] mx-auto relative z-10">
          <div className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">
            LEGAL
          </div>
          <h1 className="font-display text-[48px] md:text-[72px] leading-[1.05] mb-6">
            Privacy Policy
          </h1>
          <p className="font-mono text-sm text-[#F4F1EA]/50 tracking-wide">
            Effective June 30, 2026
          </p>
        </div>
      </header>

      <main className="px-6 pb-32">
        <div className="max-w-[820px] mx-auto space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl md:text-3xl mb-4">{section.heading}</h2>
              <div className="space-y-4">
                {section.body.map((p, i) => (
                  <p key={i} className="text-[#F4F1EA]/70 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
