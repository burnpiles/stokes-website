import React, { useState } from "react";
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
import type { BrandStat } from "@workspace/api-client-react";

export type FieldType = "text" | "number" | "textarea" | "boolean" | "tags" | "image" | "brandstats";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
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

export function ResourceEditor({ title, description, items, fields, newDraft, onCreate, onUpdate, onDelete, titleKey, maxItems }: ResourceEditorProps) {
  const atMax = typeof maxItems === "number" && items.length >= maxItems;
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl text-[#F4F1EA] mb-1">{title}</h2>
        {description && <p className="font-sans text-sm text-[#F4F1EA]/50">{description}</p>}
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <ItemRow key={item.id} item={item as { id: number } & Record<string, unknown>} fields={fields} titleKey={titleKey} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
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
