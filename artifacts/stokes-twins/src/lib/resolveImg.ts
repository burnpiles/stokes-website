export function resolveImg(url: string | null | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//.test(url) || url.startsWith("/")) return url;
  return `${import.meta.env.BASE_URL}${url}`;
}
