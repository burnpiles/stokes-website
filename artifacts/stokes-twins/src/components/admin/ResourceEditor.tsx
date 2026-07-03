import React, { useMemo, useState } from "react";
import {
  TextField,
  TextAreaField,
  NumberField,
  BoolField,
  TagsField,
  ImageField,
  adminCardCls,
  adminBtnPrimary,
  adminBtnGhost,
  adminBtnDanger,
} from "./AdminPrimitives";
import type { BrandStat, PlatformLink } from "@workspace/api-client-react";

export type FieldType = "text" | "number" | "textarea" | "boolean" | "tags" | "image" | "brandstats" | "links" | "multiselect";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
}

const MULTI_SEPARATOR = " · ";

function MultiSelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const selected = value.split(MULTI_SEPARATOR).map((s) => s.trim()).filter(Boolean);

  function toggle(option: string) {
    const next = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...options.filter((o) => selected.includes(o) || o === option)];
    onChange(next.join(MULTI_SEPARATOR));
  }

  return (
    <div className="col-span-2 md:col-span-1">
      <label className="block font-mono text-[10px] tracking-[0.18em] text-[#F4F1EA]/50 uppercase mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`font-mono text-xs px-3 py-2 rounded-[4px] border transition-colors ${
                active
                  ? "bg-[#E13B2C] border-[#E13B2C] text-white"
                  : "bg-[#0A0A0A] border-[#F4F1EA]/15 text-[#F4F1EA]/60 hover:border-[#E13B2C]/50 hover:text-[#F4F1EA]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type Draft = Record<string, unknown>;

interface ResourceEditorProps {
  title: string;
  description?: string;
  items: ReadonlyArray<{ id: number }>;
  fields: FieldDef[];
  newDraft: () => Draft;
  onCreate: (data: Draft) => Promise<unknown>;
  onUpdate: (id: number, data: Draft) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  titleKey: string;
  maxItems?: number;
  sortable?: boolean;
}

function BrandStatsEditor({ value, onChange }: { value: BrandStat[]; onChange: (v: BrandStat[]) => void }) {
  return (
    <div className="col-span-2">
      <label className="block font-mono text-[10px] tracking-[0.18em] text-[#F4F1EA]/50 uppercase mb-2">Campaign Stats</label>
      <div className="space-y-2">
        {value.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="flex-1 bg-[#0A0A0A] border border-[#F4F1EA]/15 rounded-[4px] px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E13B2C]/60"
              placeholder="Label (e.g. Impressions)"
              value={s.label}
              onChange={(e) => onChange(value.map((x, xi) => (xi === i ? { ...x, label: e.target.value } : x)))}
            />
            <input
              className="w-32 bg-[#0A0A0A] border border-[#F4F1EA]/15 rounded-[4px] px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E13B2C]/60"
              placeholder="Value"
              value={s.value}
              onChange={(e) => onChange(value.map((x, xi) => (xi === i ? { ...x, value: e.target.value } : x)))}
            />
            <button type="button" className="text-[#E13B2C] font-mono text-xs px-2" onClick={() => onChange(value.filter((_, xi) => xi !== i))}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" className={adminBtnGhost} onClick={() => onChange([...value, { label: "", value: "" }])}>
          + ADD STAT
        </button>
      </div>
    </div>
  );
}

function LinksEditor({ label, value, onChange }: { label: string; value: PlatformLink[]; onChange: (v: PlatformLink[]) => void }) {
  return (
    <div className="col-span-2">
      <label className="block font-mono text-[10px] tracking-[0.18em] text-[#F4F1EA]/50 uppercase mb-2">{label}</label>
      <div className="space-y-2">
        {value.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="w-40 bg-[#0A0A0A] border border-[#F4F1EA]/15 rounded-[4px] px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E13B2C]/60"
              placeholder="Label (e.g. Top Videos)"
              value={s.label}
              onChange={(e) => onChange(value.map((x, xi) => (xi === i ? { ...x, label: e.target.value } : x)))}
            />
            <input
              className="w-24 bg-[#0A0A0A] border border-[#F4F1EA]/15 rounded-[4px] px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E13B2C]/60"
              placeholder="Subs"
              value={s.value}
              onChange={(e) => onChange(value.map((x, xi) => (xi === i ? { ...x, value: e.target.value } : x)))}
            />
            <input
              className="flex-1 bg-[#0A0A0A] border border-[#F4F1EA]/15 rounded-[4px] px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E13B2C]/60"
              placeholder="https://…"
              value={s.url}
              onChange={(e) => onChange(value.map((x, xi) => (xi === i ? { ...x, url: e.target.value } : x)))}
            />
            <button type="button" className="text-[#E13B2C] font-mono text-xs px-2" onClick={() => onChange(value.filter((_, xi) => xi !== i))}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" className={adminBtnGhost} onClick={() => onChange([...value, { label: "", value: "", url: "" }])}>
          + ADD LINK
        </button>
      </div>
    </div>
  );
}

function renderField(field: FieldDef, draft: Draft, set: (key: string, v: unknown) => void) {
  const v = draft[field.key];
  switch (field.type) {
    case "number":
      return <NumberField key={field.key} label={field.label} value={typeof v === "number" ? v : Number(v ?? 0)} onChange={(nv) => set(field.key, nv)} />;
    case "textarea":
      return <TextAreaField key={field.key} label={field.label} value={String(v ?? "")} placeholder={field.placeholder} onChange={(nv) => set(field.key, nv)} />;
    case "boolean":
      return <BoolField key={field.key} label={field.label} value={Boolean(v)} onChange={(nv) => set(field.key, nv)} />;
    case "tags":
      return <TagsField key={field.key} label={field.label} value={Array.isArray(v) ? (v as string[]) : []} onChange={(nv) => set(field.key, nv)} />;
    case "image":
      return <ImageField key={field.key} label={field.label} value={String(v ?? "")} onChange={(nv) => set(field.key, nv)} />;
    case "brandstats":
      return <BrandStatsEditor key={field.key} value={Array.isArray(v) ? (v as BrandStat[]) : []} onChange={(nv) => set(field.key, nv)} />;
    case "links":
      return <LinksEditor key={field.key} label={field.label} value={Array.isArray(v) ? (v as PlatformLink[]) : []} onChange={(nv) => set(field.key, nv)} />;
    case "multiselect":
      return <MultiSelectField key={field.key} label={field.label} value={String(v ?? "")} options={field.options ?? []} onChange={(nv) => set(field.key, nv)} />;
    default:
      return <TextField key={field.key} label={field.label} value={String(v ?? "")} placeholder={field.placeholder} onChange={(nv) => set(field.key, nv)} />;
  }
}

function ItemRow({ item, fields, titleKey, onUpdate, onDelete }: { item: { id: number } & Record<string, unknown>; fields: FieldDef[]; titleKey: string; onUpdate: (id: number, data: Draft) => Promise<unknown>; onDelete: (id: number) => Promise<unknown> }) {
  const [draft, setDraft] = useState<Draft>(() => ({ ...item }));
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = (key: string, v: unknown) => setDraft((d) => ({ ...d, [key]: v }));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const { id, ...data } = draft;
      void id;
      await onUpdate(item.id, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete "${String(item[titleKey] ?? "this item")}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={adminCardCls}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-left">
        <span className="font-display text-lg text-[#F4F1EA]">{String(item[titleKey] ?? `#${item.id}`)}</span>
        <span className="font-mono text-xs text-[#F4F1EA]/40">{open ? "− COLLAPSE" : "+ EDIT"}</span>
      </button>
      {open && (
        <>
          <div className="grid grid-cols-2 gap-4 mt-5">
            {fields.map((f) => renderField(f, draft, set))}
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#F4F1EA]/10">
            <button type="button" className={adminBtnPrimary} disabled={saving} onClick={save}>
              {saving ? "SAVING…" : "SAVE"}
            </button>
            <button type="button" className={adminBtnDanger} disabled={deleting} onClick={remove}>
              {deleting ? "DELETING…" : "DELETE"}
            </button>
            {saved && <span className="font-mono text-[11px] text-[#E8B547]">✓ Saved</span>}
          </div>
        </>
      )}
    </div>
  );
}

function CreateRow({ fields, newDraft, onCreate }: { fields: FieldDef[]; newDraft: () => Draft; onCreate: (data: Draft) => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(newDraft);
  const [creating, setCreating] = useState(false);
  const set = (key: string, v: unknown) => setDraft((d) => ({ ...d, [key]: v }));

  async function create() {
    setCreating(true);
    try {
      await onCreate(draft);
      setDraft(newDraft());
      setOpen(false);
    } finally {
      setCreating(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="w-full border-2 border-dashed border-[#F4F1EA]/15 rounded-[6px] py-4 font-mono text-xs tracking-widest text-[#F4F1EA]/50 hover:border-[#E13B2C]/50 hover:text-[#E13B2C] transition-colors">
        + ADD NEW
      </button>
    );
  }

  return (
    <div className={`${adminCardCls} border-[#E13B2C]/30`}>
      <div className="font-mono text-[11px] tracking-widest text-[#E13B2C] mb-4">NEW ITEM</div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => renderField(f, draft, set))}
      </div>
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#F4F1EA]/10">
        <button type="button" className={adminBtnPrimary} disabled={creating} onClick={create}>
          {creating ? "CREATING…" : "CREATE"}
        </button>
        <button type="button" className={adminBtnGhost} onClick={() => { setOpen(false); setDraft(newDraft()); }}>
          CANCEL
        </button>
      </div>
    </div>
  );
}

export function ResourceEditor({ title, description, items, fields, newDraft, onCreate, onUpdate, onDelete, titleKey, maxItems, sortable }: ResourceEditorProps) {
  const atMax = typeof maxItems === "number" && items.length >= maxItems;
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [localIds, setLocalIds] = useState<number[] | null>(null);
  const [reordering, setReordering] = useState(false);
  const [reorderError, setReorderError] = useState(false);

  const displayed = useMemo(() => {
    const base = sortable
      ? [...items].sort((a, b) => (((a as Record<string, unknown>).sortOrder as number) ?? 0) - (((b as Record<string, unknown>).sortOrder as number) ?? 0))
      : [...items];
    if (!localIds) return base;
    const map = new Map(base.map((i) => [i.id, i]));
    const ordered = localIds.map((id) => map.get(id)).filter((i): i is { id: number } => Boolean(i));
    for (const it of base) if (!localIds.includes(it.id)) ordered.push(it);
    return ordered;
  }, [items, localIds, sortable]);

  async function handleDrop(from: number, to: number) {
    if (from === to || reordering) return;
    const arr = [...displayed];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setLocalIds(arr.map((i) => i.id));
    setReordering(true);
    setReorderError(false);
    try {
      const changed = arr
        .map((it, idx) => ({ it, sort: idx + 1 }))
        .filter(({ it, sort }) => ((it as Record<string, unknown>).sortOrder as number) !== sort);
      for (const { it, sort } of changed) {
        await onUpdate(it.id, { sortOrder: sort });
      }
    } catch {
      setLocalIds(null);
      setReorderError(true);
    } finally {
      setReordering(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl text-[#F4F1EA] mb-1">{title}</h2>
        {description && <p className="font-sans text-sm text-[#F4F1EA]/50">{description}</p>}
        {sortable && (
          <p className={`font-mono text-[11px] tracking-wide mt-2 ${reorderError ? "text-[#E13B2C]" : "text-[#F4F1EA]/35"}`}>
            {reordering
              ? "SAVING ORDER…"
              : reorderError
                ? "✕ COULDN'T SAVE THE NEW ORDER — IT HAS BEEN RESET. TRY AGAIN."
                : "⠿ DRAG THE HANDLE TO REORDER — SORT NUMBERS UPDATE AUTOMATICALLY"}
          </p>
        )}
      </div>
      <div className="space-y-3">
        {displayed.map((item, idx) =>
          sortable ? (
            <div
              key={item.id}
              data-testid={`sortable-row-${item.id}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragIndex !== null) setOverIndex(idx);
              }}
              onDragLeave={() => setOverIndex((o) => (o === idx ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) void handleDrop(dragIndex, idx);
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`flex items-stretch gap-2 rounded-[6px] transition-shadow ${
                overIndex === idx && dragIndex !== null && dragIndex !== idx ? "ring-2 ring-[#E13B2C]/70" : ""
              } ${dragIndex === idx ? "opacity-50" : ""}`}
            >
              <div
                draggable
                data-testid={`drag-handle-${item.id}`}
                onDragStart={(e) => {
                  setDragIndex(idx);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                title="Drag to reorder"
                className="flex flex-col items-center justify-center px-2 rounded-[6px] border border-[#F4F1EA]/10 bg-[#141414] cursor-grab active:cursor-grabbing text-[#F4F1EA]/40 hover:text-[#F4F1EA] hover:border-[#E13B2C]/40 select-none shrink-0"
              >
                <span className="font-mono text-[10px] mb-1">{idx + 1}</span>
                <span className="text-sm leading-none">⠿</span>
              </div>
              <div className="flex-1 min-w-0">
                <ItemRow item={item as { id: number } & Record<string, unknown>} fields={fields} titleKey={titleKey} onUpdate={onUpdate} onDelete={onDelete} />
              </div>
            </div>
          ) : (
            <ItemRow key={item.id} item={item as { id: number } & Record<string, unknown>} fields={fields} titleKey={titleKey} onUpdate={onUpdate} onDelete={onDelete} />
          )
        )}
        {atMax ? (
          <div className="border-2 border-dashed border-[#F4F1EA]/10 rounded-[6px] py-4 text-center font-mono text-xs tracking-widest text-[#F4F1EA]/40">
            MAXIMUM OF {maxItems} REACHED — DELETE ONE TO ADD ANOTHER
          </div>
        ) : (
          <CreateRow fields={fields} newDraft={newDraft} onCreate={onCreate} />
        )}
      </div>
    </div>
  );
}
