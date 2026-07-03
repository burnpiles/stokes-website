import { Router, type IRouter, type Request, type Response } from "express";
import { asc } from "drizzle-orm";
import {
  db,
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
import { GetContentResponse } from "@workspace/api-zod";

const router: IRouter = Router();

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

  const payload = {
    settings: settingsRow?.data ?? defaultSettings,
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
