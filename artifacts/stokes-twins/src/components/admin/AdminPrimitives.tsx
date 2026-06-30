import React, { useRef, useState } from "react";
import { useUploadMedia, mediaUrl } from "@/lib/uploadMedia";
import { resolveImg } from "@/lib/resolveImg";

const labelCls = "block font-mono text-[10px] tracking-[0.18em] text-[#F4F1EA]/50 uppercase mb-2";
const inputCls =
  "w-full bg-[#0A0A0A] border border-[#F4F1EA]/15 rounded-[4px] px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#E13B2C]/60 transition-colors";

export function TextField({ label, value, onChange, placeholder, full }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className={labelCls}>{label}</label>
      <input className={inputCls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="col-span-2">
      <label className={labelCls}>{label}</label>
      <textarea className={`${inputCls} min-h-[80px] resize-y`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        step="any"
        className={inputCls}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </div>
  );
}

export function BoolField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 pt-6">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-[#E13B2C]" : "bg-[#F4F1EA]/20"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
      <span className="font-mono text-xs text-[#F4F1EA]/70">{label}</span>
    </div>
  );
}

export function TagsField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join(", "));
  return (
    <div className="col-span-2">
      <label className={labelCls}>{label} (comma-separated)</label>
      <input
        className={inputCls}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean));
        }}
      />
    </div>
  );
}

export function ImageField({ label, value, onChange, onPick }: { label: string; value: string; onChange: (v: string) => void; onPick?: () => void }) {
  const { uploadFile, isUploading } = useUploadMedia();
  const fileRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    try {
      const media = await uploadFile(file);
      onChange(mediaUrl(media.objectPath));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="col-span-2">
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-[4px] bg-[#0A0A0A] border border-[#F4F1EA]/15 overflow-hidden flex items-center justify-center flex-none">
          {value ? (
            <img src={resolveImg(value)} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-[9px] text-[#F4F1EA]/30">none</span>
          )}
        </div>
        <div className="flex-1">
          <input className={inputCls} value={value} placeholder="seed/... or /api/storage/..." onChange={(e) => onChange(e.target.value)} />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="font-mono text-[10px] tracking-widest bg-[#E13B2C] text-white px-3 py-1.5 rounded-[3px] hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50"
            >
              {isUploading ? "UPLOADING…" : "UPLOAD"}
            </button>
            {onPick && (
              <button
                type="button"
                onClick={onPick}
                className="font-mono text-[10px] tracking-widest border border-[#F4F1EA]/20 text-[#F4F1EA]/70 px-3 py-1.5 rounded-[3px] hover:border-[#F4F1EA]/50 transition-colors"
              >
                PICK
              </button>
            )}
          </div>
          {err && <div className="font-mono text-[10px] text-[#E13B2C] mt-1">{err}</div>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export const adminCardCls = "bg-[#141210] border border-[#F4F1EA]/10 rounded-[6px] p-5";
export const adminBtnPrimary =
  "font-mono text-[11px] tracking-widest bg-[#E13B2C] text-white px-4 py-2 rounded-[3px] hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50";
export const adminBtnGhost =
  "font-mono text-[11px] tracking-widest border border-[#F4F1EA]/20 text-[#F4F1EA]/70 px-4 py-2 rounded-[3px] hover:border-[#F4F1EA]/50 transition-colors disabled:opacity-50";
export const adminBtnDanger =
  "font-mono text-[11px] tracking-widest border border-[#E13B2C]/40 text-[#E13B2C] px-4 py-2 rounded-[3px] hover:bg-[#E13B2C] hover:text-white transition-colors disabled:opacity-50";
