import React, { useState, useEffect, useMemo } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useContent } from "@/lib/content";

export default function CareersPage() {
  const { settings, jobs } = useContent();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    document.title = "Careers | Stokes Twins";
    document.body.style.backgroundColor = "#0A0A0A";
    window.scrollTo(0, 0);
  }, []);

  const activeJobs = useMemo(
    () => jobs.filter((j) => j.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [jobs],
  );

  const depts = useMemo(() => {
    const seen: string[] = [];
    for (const j of activeJobs) {
      if (j.department && !seen.includes(j.department)) seen.push(j.department);
    }
    return ["All", ...seen];
  }, [activeJobs]);

  const filteredRoles = activeJobs.filter((role) => filter === "All" || role.department === filter);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F1EA] overflow-x-hidden pt-20">
      <Nav isCareers={true} />

      <header className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Glow Orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E13B2C]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="max-w-[1000px] mx-auto relative z-10">
          <div className="font-mono text-[#E13B2C] text-sm tracking-[0.2em] font-bold mb-6">{settings.careersSection.eyebrow}</div>
          <h1 className="font-display text-[64px] md:text-[88px] leading-[1] mb-8">{settings.careersSection.headline}</h1>
          <p className="font-sans text-xl md:text-2xl text-[#F4F1EA]/70 leading-relaxed font-medium max-w-[800px] mb-12">
            {settings.careersSection.body}
          </p>

          <div className="font-mono font-bold text-sm tracking-widest border-b border-[#F4F1EA]/10 pb-6 mb-8">
            <span className="text-[#E13B2C]">{filteredRoles.length}</span> OPEN ROLES · NOW HIRING
          </div>

          <div className="flex flex-wrap gap-3">
            {depts.map(dept => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                data-testid={`careers-filter-${dept.toLowerCase().replace(/ /g, '-')}`}
                className={`px-5 py-2.5 rounded-[4px] font-mono text-xs font-bold tracking-widest transition-all ${
                  filter === dept
                    ? 'bg-[#E13B2C] text-white border border-[#E13B2C]'
                    : 'bg-transparent text-[#F4F1EA]/60 border border-[#F4F1EA]/20 hover:text-white hover:border-[#F4F1EA]/40'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="pb-32 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col">
            {filteredRoles.map((role, idx) => (
              <div
                key={role.id}
                data-testid={`careers-role-${idx}`}
                className="group py-10 border-t border-[#F4F1EA]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#141210] transition-colors -mx-6 px-6"
              >
                <div>
                  <div className="inline-block border border-[#E13B2C]/50 px-2 py-1 rounded text-[#E13B2C] font-mono text-[10px] font-bold tracking-widest mb-4 bg-[#E13B2C]/10">
                    {(role.brand ?? "Stokes Twins").toUpperCase()}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl mb-4 group-hover:text-[#E13B2C] transition-colors">
                    {role.title}
                  </h3>
                  <div className="font-mono text-sm text-[#F4F1EA]/60 flex flex-wrap gap-x-3 gap-y-2">
                    <span>{role.department}</span>
                    <span className="text-[#F4F1EA]/30">·</span>
                    <span>{role.location}</span>
                    <span className="text-[#F4F1EA]/30">·</span>
                    <span className="text-[#E8B547] font-bold">{role.type}</span>
                  </div>
                </div>

                <a
                  href={role.applyUrl && role.applyUrl !== "#" ? role.applyUrl : "#"}
                  target={role.applyUrl && role.applyUrl !== "#" ? "_blank" : undefined}
                  rel={role.applyUrl && role.applyUrl !== "#" ? "noopener noreferrer" : undefined}
                  data-testid={`apply-btn-${idx}`}
                  className="inline-flex items-center justify-center bg-[#E13B2C] text-white font-mono font-bold text-sm tracking-widest px-8 py-4 rounded-[3px] hover:bg-white hover:text-[#0A0A0A] transition-colors shrink-0 md:opacity-0 md:-translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 duration-300"
                  onClick={(e) => {
                    if (!role.applyUrl || role.applyUrl === "#") {
                      e.preventDefault();
                      alert("Applications open soon.");
                    }
                  }}
                >
                  APPLY →
                </a>
              </div>
            ))}

            {filteredRoles.length === 0 && (
              <div className="py-20 text-center font-mono text-[#F4F1EA]/50 border-t border-[#F4F1EA]/10">
                No open roles in this department currently.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
