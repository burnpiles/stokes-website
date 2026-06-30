export function extractYouTubeId(input: string | null | undefined): string {
  if (!input) return "";
  const s = input.trim();
  if (!s) return "";

  if (!s.includes("/") && /^[A-Za-z0-9_-]{6,}$/.test(s)) return s;

  try {
    const url = new URL(s);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? "";
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => ["shorts", "embed", "v", "live"].includes(p));
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    return "";
  }
  return "";
}

export function youtubeThumb(
  input: string | null | undefined,
  quality: "max" | "hq" = "max",
): string {
  const id = extractYouTubeId(input);
  if (!id) return "";
  const file = quality === "max" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}
