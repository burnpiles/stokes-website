import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListMedia, useDeleteMedia, getListMediaQueryKey } from "@workspace/api-client-react";
import { useUploadMedia, mediaUrl } from "@/lib/uploadMedia";
import { adminBtnPrimary, adminBtnDanger } from "./AdminPrimitives";

export function MediaLibrary() {
  const queryClient = useQueryClient();
  const { data: media = [] } = useListMedia();
  const deleteMedia = useDeleteMedia();
  const { uploadFile, isUploading } = useUploadMedia();
  const fileRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setErr(null);
    try {
      for (const f of files) await uploadFile(f);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this media file?")) return;
    await deleteMedia.mutateAsync({ id });
    await queryClient.invalidateQueries({ queryKey: getListMediaQueryKey() });
  }

  function copyPath(id: number, path: string) {
    navigator.clipboard?.writeText(mediaUrl(path));
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl text-[#F4F1EA] mb-1">Media Library</h2>
          <p className="font-sans text-sm text-[#F4F1EA]/50">Upload images, then copy a path into any image field.</p>
        </div>
        <button type="button" className={adminBtnPrimary} disabled={isUploading} onClick={() => fileRef.current?.click()}>
          {isUploading ? "UPLOADING…" : "+ UPLOAD"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      </div>

      {err && <div className="font-mono text-[11px] text-[#E13B2C] mb-4">{err}</div>}

      {media.length === 0 ? (
        <div className="border-2 border-dashed border-[#F4F1EA]/15 rounded-[6px] py-16 text-center font-mono text-xs text-[#F4F1EA]/40">
          No media yet — upload your first image.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((m) => (
            <div key={m.id} className="bg-[#141210] border border-[#F4F1EA]/10 rounded-[6px] overflow-hidden">
              <div className="aspect-square bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
                <img src={mediaUrl(m.objectPath)} alt={m.filename} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="font-mono text-[11px] text-[#F4F1EA]/70 truncate mb-2" title={m.filename}>{m.filename}</div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => copyPath(m.id, m.objectPath)} className="flex-1 font-mono text-[9px] tracking-widest border border-[#F4F1EA]/20 text-[#F4F1EA]/70 px-2 py-1.5 rounded-[3px] hover:border-[#F4F1EA]/50 transition-colors">
                    {copied === m.id ? "COPIED!" : "COPY PATH"}
                  </button>
                  <button type="button" onClick={() => remove(m.id)} className={`${adminBtnDanger} !px-2 !py-1.5 !text-[9px]`}>
                    DEL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
