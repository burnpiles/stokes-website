import React, { useMemo, useState } from "react";
import { useListVisitors } from "@workspace/api-client-react";
import type { Visitor } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminCardCls, adminBtnGhost } from "./AdminPrimitives";

type SortKey = "name" | "firstAccessedAt" | "lastAccessedAt" | "successfulAccessCount";

function fmt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${date} at ${time}`;
}

function toCsv(rows: Visitor[]): string {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = "Name,Email,First Access,Most Recent Access,Successful Access Count";
  const lines = rows.map((r) =>
    [r.name, r.email, fmt(r.firstAccessedAt), fmt(r.lastAccessedAt), r.successfulAccessCount].map(esc).join(","),
  );
  return [header, ...lines].join("\n");
}

export function AccessVisitors() {
  const { data, isLoading, isError } = useListVisitors();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastAccessedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [detail, setDetail] = useState<Visitor | null>(null);

  const visitors = useMemo(() => {
    const list = [...(data ?? [])];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? list.filter((v) => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q))
      : list;
    filtered.sort((a, b) => {
      let cmp: number;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "successfulAccessCount") cmp = a.successfulAccessCount - b.successfulAccessCount;
      else cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return filtered;
  }, [data, search, sortKey, sortDir]);

  const headerBtn = (key: SortKey, label: string) => (
    <button
      type="button"
      onClick={() => {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir(key === "name" ? "asc" : "desc"); }
      }}
      className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#F4F1EA]/50 hover:text-[#F4F1EA] transition-colors"
      data-testid={`visitors-sort-${key}`}
    >
      {label}
      {sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );

  const exportCsv = () => {
    const blob = new Blob([toCsv(visitors)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "protected-section-visitors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="admin-access">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl mb-1">Protected Section Visitors</h2>
          <p className="font-sans text-sm text-[#F4F1EA]/50">
            People who successfully unlocked the private audience and case-study section.
          </p>
        </div>
        <button type="button" onClick={exportCsv} disabled={visitors.length === 0} className={adminBtnGhost} data-testid="visitors-export-csv">
          EXPORT CSV
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search visitors by name or email"
        data-testid="visitors-search"
        className="w-full max-w-md bg-[#141210] border border-[#F4F1EA]/15 rounded-[4px] px-4 py-2.5 text-sm text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 focus:outline-none focus:border-[#E13B2C]/60 transition-colors mb-6"
      />

      {isLoading ? (
        <div className={`${adminCardCls} font-mono text-xs text-[#F4F1EA]/50`}>LOADING…</div>
      ) : isError ? (
        <div className={`${adminCardCls} font-mono text-xs text-[#E13B2C]`} data-testid="visitors-error">
          Unable to load protected-section visitors. Please try again.
        </div>
      ) : visitors.length === 0 ? (
        <div className={`${adminCardCls} font-mono text-xs text-[#F4F1EA]/50`} data-testid="visitors-empty">
          {search.trim()
            ? "No visitors match your search."
            : "No visitors have accessed the protected section yet."}
        </div>
      ) : (
        <div className="border border-[#F4F1EA]/10 rounded-[6px] overflow-x-auto">
          <table className="w-full text-left" data-testid="visitors-table">
            <thead>
              <tr className="bg-[#141210] border-b border-[#F4F1EA]/10">
                <th className="px-4 py-3">{headerBtn("name", "Name")}</th>
                <th className="px-4 py-3">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#F4F1EA]/50">Email</span>
                </th>
                <th className="px-4 py-3">{headerBtn("firstAccessedAt", "First Access")}</th>
                <th className="px-4 py-3">{headerBtn("lastAccessedAt", "Most Recent Access")}</th>
                <th className="px-4 py-3">{headerBtn("successfulAccessCount", "Successful Accesses")}</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setDetail(v)}
                  className="border-b border-[#F4F1EA]/5 last:border-b-0 hover:bg-[#141210] cursor-pointer transition-colors"
                  data-testid={`visitor-row-${v.id}`}
                >
                  <td className="px-4 py-3 font-sans text-sm">{v.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#F4F1EA]/70">{v.email}</td>
                  <td className="px-4 py-3 font-sans text-xs text-[#F4F1EA]/60 whitespace-nowrap">{fmt(v.firstAccessedAt)}</td>
                  <td className="px-4 py-3 font-sans text-xs text-[#F4F1EA]/60 whitespace-nowrap">{fmt(v.lastAccessedAt)}</td>
                  <td className="px-4 py-3 font-mono text-sm text-[#E13B2C]">{v.successfulAccessCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(open) => { if (!open) setDetail(null); }}>
        <DialogContent className="bg-[#0A0A0A] border border-[#F4F1EA]/10 text-[#F4F1EA] max-w-md">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-[#F4F1EA] text-left">{detail.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                {[
                  ["Email", detail.email],
                  ["First successful access", fmt(detail.firstAccessedAt)],
                  ["Most recent successful access", fmt(detail.lastAccessedAt)],
                  ["Total successful accesses", String(detail.successfulAccessCount)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#F4F1EA]/40 mb-0.5">{label}</div>
                    <div className="font-sans text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
