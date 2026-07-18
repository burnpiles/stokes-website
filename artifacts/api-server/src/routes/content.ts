import { Router, type IRouter, type Request, type Response } from "express";
import { asc, sql } from "drizzle-orm";
import {
  db,
  visitorsTable,
  settingsTable,
  statsTable,
  platformsTable,
  videosTable,
  shortsTable,
  demographicsTable,
  brandsTable,
  pressTable,
  jobsTable,
  defaultSettings,
} from "@workspace/db";
import { GetContentResponse, UnlockDataBody, UnlockDataResponse } from "@workspace/api-zod";
import { extractYoutubeId, getLiveViewCounts, getChannelSubscribers } from "../lib/youtube";

const router: IRouter = Router();

router.post("/data/unlock", async (req: Request, res: Response) => {
  const parsed = UnlockDataBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const expected = process.env.DATA_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!expected) {
    req.log.error("DATA_PASSWORD/ADMIN_PASSWORD is not configured");
    res.status(500).json({ error: "Server not configured" });
    return;
  }
  if (parsed.data.password !== expected) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  // Record the visitor only after the password is verified. Never store the
  // submitted password. Failure to record must not block access.
  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  try {
    const now = new Date();
    await db
      .insert(visitorsTable)
      .values({ name, email })
      .onConflictDoUpdate({
        target: visitorsTable.email,
        set: {
          name,
          lastAccessedAt: now,
          updatedAt: now,
          successfulAccessCount: sql`${visitorsTable.successfulAccessCount} + 1`,
        },
      });
  } catch (err) {
    req.log.error({ err }, "Failed to record protected-section visitor");
  }
  res.json(UnlockDataResponse.parse({ authenticated: true }));
});

router.get("/content", async (_req: Request, res: Response) => {
  const [settingsRow] = await db.select().from(settingsTable).limit(1);
  const [stats, platforms, videos, shorts, demographics, brands, press, jobs] =
    await Promise.all([
      db.select().from(statsTable).orderBy(asc(statsTable.sortOrder)),
      db.select().from(platformsTable).orderBy(asc(platformsTable.sortOrder)),
      db.select().from(videosTable).orderBy(asc(videosTable.sortOrder)),
      db.select().from(shortsTable).orderBy(asc(shortsTable.sortOrder)),
      db
        .select()
        .from(demographicsTable)
        .orderBy(asc(demographicsTable.sortOrder)),
      db.select().from(brandsTable).orderBy(asc(brandsTable.sortOrder)),
      db.select().from(pressTable).orderBy(asc(pressTable.sortOrder)),
      db.select().from(jobsTable).orderBy(asc(jobsTable.sortOrder)),
    ]);

  let settings = settingsRow?.data ?? defaultSettings;

  // Overlay live YouTube data (video/short view counts + channel subscriber
  // count). On failure, the stored DB values are served unchanged.
  const ids = [...videos, ...shorts]
    .map((v) => extractYoutubeId(v.youtubeUrl))
    .filter((id): id is string => id !== null);
  const ytPlatform = platforms.find((p) => p.iconKey === "youtube");
  const handle = (ytPlatform?.handle ?? "@stokestwins").replace(/^@/, "");

  const [countsResult, subsResult] = await Promise.allSettled([
    ids.length > 0 ? getLiveViewCounts(ids) : Promise.resolve(new Map<string, string>()),
    getChannelSubscribers(handle),
  ]);

  if (countsResult.status === "fulfilled") {
    const counts = countsResult.value;
    for (const v of [...videos, ...shorts]) {
      const id = extractYoutubeId(v.youtubeUrl);
      const live = id ? counts.get(id) : undefined;
      if (live) v.views = live;
    }
  } else {
    _req.log.warn(
      { err: countsResult.reason },
      "Live YouTube view counts unavailable; serving stored views",
    );
  }

  if (subsResult.status === "fulfilled") {
    const subs = subsResult.value;
    // Anchor the animated counter to the real subscriber count at fetch
    // time so it never drifts ahead of reality between refreshes.
    settings = {
      ...settings,
      youtubeCounter: {
        ...settings.youtubeCounter,
        base: subs.count,
        anchorIso: subs.anchorIso,
        target: Math.max(settings.youtubeCounter.target, subs.count + 1_000_000),
      },
    };
  } else {
    _req.log.warn(
      { err: subsResult.reason },
      "Live YouTube subscriber count unavailable; serving stored counter settings",
    );
    // Re-anchor the stored baseline to "now" so the client does not
    // extrapolate growth for all the time elapsed since the stored
    // anchor — the counter must start at the stored base and only
    // simulate growth from page load onward.
    settings = {
      ...settings,
      youtubeCounter: {
        ...settings.youtubeCounter,
        anchorIso: new Date().toISOString(),
      },
    };
  }

  const payload = {
    settings,
    stats,
    platforms,
    videos,
    shorts,
    demographics,
    brands,
    press,
    jobs,
  };

  res.json(GetContentResponse.parse(payload));
});

export default router;
