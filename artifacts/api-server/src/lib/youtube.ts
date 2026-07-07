// Live YouTube view counts via the Replit YouTube connector integration.
// The SDK proxies requests to the YouTube Data API v3 with automatic auth.
import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedAt = 0;
let cachedKey = "";
let cachedCounts: Map<string, string> | null = null;
// Last successful fetch (with its ID-set key), kept indefinitely as a
// fallback if the API is down.
let lastGood: { key: string; counts: Map<string, string> } | null = null;
// In-flight fetch, shared across concurrent requests to avoid duplicate calls.
let inflight: { key: string; promise: Promise<Map<string, string>> } | null = null;

export function extractYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

export function formatViewCount(n: number): string {
  const oneDecimal = (x: number) => {
    const r = Math.floor(x * 10) / 10;
    return Number.isInteger(r) ? r.toString() : r.toFixed(1);
  };
  if (n >= 1e9) return `${oneDecimal(n / 1e9)}B+`;
  if (n >= 1e6) return `${Math.floor(n / 1e6)}M+`;
  if (n >= 1e3) return `${Math.floor(n / 1e3)}K+`;
  return n.toString();
}

async function fetchViewCounts(ids: string[]): Promise<Map<string, string>> {
  const counts = new Map<string, string>();
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const resp = await connectors.proxy(
      "youtube",
      `/youtube/v3/videos?part=statistics&id=${batch.join(",")}`,
      { method: "GET" },
    );
    if (!resp.ok) {
      throw new Error(`YouTube API responded with status ${resp.status}`);
    }
    const data = (await resp.json()) as {
      items?: Array<{ id?: string; statistics?: { viewCount?: string } }>;
    };
    for (const item of data.items ?? []) {
      const viewCount = Number(item.statistics?.viewCount);
      if (item.id && Number.isFinite(viewCount)) {
        counts.set(item.id, formatViewCount(viewCount));
      }
    }
  }
  return counts;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`YouTube API timed out after ${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

type SubsResult = { anchorIso: string; count: number };
const subsCache = new Map<string, { at: number } & SubsResult>();
const lastGoodSubs = new Map<string, SubsResult>();
const inflightSubs = new Map<string, Promise<SubsResult>>();

async function fetchSubscriberCount(handle: string): Promise<number> {
  const resp = await connectors.proxy(
    "youtube",
    `/youtube/v3/channels?part=statistics&forHandle=${encodeURIComponent(handle)}`,
    { method: "GET" },
  );
  if (!resp.ok) {
    throw new Error(`YouTube API responded with status ${resp.status}`);
  }
  const data = (await resp.json()) as {
    items?: Array<{ statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean } }>;
  };
  const stats = data.items?.[0]?.statistics;
  const count = Number(stats?.subscriberCount);
  if (stats?.hiddenSubscriberCount || !Number.isFinite(count) || count <= 0) {
    throw new Error("Subscriber count unavailable for channel");
  }
  return count;
}

/**
 * Live subscriber count for a channel handle, with the timestamp it was
 * fetched at (so the client-side ticker can anchor to the real number).
 * Cached 5 minutes; falls back to the last successful result on failure.
 */
export async function getChannelSubscribers(handle: string): Promise<SubsResult> {
  const key = handle.trim().toLowerCase();
  const cached = subsCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return { anchorIso: cached.anchorIso, count: cached.count };
  }
  const inflight = inflightSubs.get(key);
  if (inflight) return inflight;
  const promise = (async () => {
    try {
      const count = await withTimeout(fetchSubscriberCount(handle), 8000);
      const result: SubsResult = { anchorIso: new Date().toISOString(), count };
      subsCache.set(key, { at: Date.now(), ...result });
      lastGoodSubs.set(key, result);
      return result;
    } catch (err) {
      const lastGood = lastGoodSubs.get(key);
      if (lastGood) return lastGood;
      throw err;
    } finally {
      inflightSubs.delete(key);
    }
  })();
  inflightSubs.set(key, promise);
  return promise;
}

/**
 * Returns a map of videoId -> formatted live view count (e.g. "215M+").
 * Results are cached for 5 minutes. If the API fails, the last successful
 * result is returned; if there has never been one, the error propagates so
 * the caller can fall back to stored values.
 */
export async function getLiveViewCounts(ids: string[]): Promise<Map<string, string>> {
  const key = [...ids].sort().join(",");
  if (cachedCounts && cachedKey === key && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedCounts;
  }
  if (inflight && inflight.key === key) {
    return inflight.promise;
  }
  const promise = (async () => {
    try {
      const counts = await withTimeout(fetchViewCounts(ids), 8000);
      cachedAt = Date.now();
      cachedKey = key;
      cachedCounts = counts;
      lastGood = { key, counts };
      return counts;
    } catch (err) {
      if (lastGood && lastGood.key === key) return lastGood.counts;
      throw err;
    } finally {
      inflight = null;
    }
  })();
  inflight = { key, promise };
  return promise;
}
