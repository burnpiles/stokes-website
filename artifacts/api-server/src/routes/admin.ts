import {
  Router,
  type IRouter,
  type Request,
  type Response,
} from "express";
import { eq, desc } from "drizzle-orm";
import {
  db,
  settingsTable,
  statsTable,
  platformsTable,
  videosTable,
  shortsTable,
  demographicsTable,
  brandsTable,
  jobsTable,
  mediaTable,
} from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminSessionResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
  CreateStatBody,
  UpdateStatBody,
  CreateStatResponse,
  UpdateStatResponse,
  CreatePlatformBody,
  UpdatePlatformBody,
  CreatePlatformResponse,
  UpdatePlatformResponse,
  CreateVideoBody,
  UpdateVideoBody,
  CreateVideoResponse,
  UpdateVideoResponse,
  CreateShortBody,
  UpdateShortBody,
  CreateShortResponse,
  UpdateShortResponse,
  CreateDemographicBody,
  UpdateDemographicBody,
  CreateDemographicResponse,
  UpdateDemographicResponse,
  CreateBrandBody,
  UpdateBrandBody,
  CreateBrandResponse,
  UpdateBrandResponse,
  CreateJobBody,
  UpdateJobBody,
  CreateJobResponse,
  UpdateJobResponse,
  CreateMediaBody,
  CreateMediaResponse,
  ListMediaResponse,
} from "@workspace/api-zod";
import {
  requireAdmin,
  setAdminCookie,
  clearAdminCookie,
  isAdmin,
} from "../lib/auth";

const router: IRouter = Router();

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

router.post("/admin/login", (req: Request, res: Response) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    req.log.error("ADMIN_PASSWORD is not configured");
    res.status(500).json({ error: "Server not configured" });
    return;
  }
  if (parsed.data.password !== expected) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  setAdminCookie(res);
  res.json(AdminLoginResponse.parse({ authenticated: true }));
});

router.post("/admin/logout", (_req: Request, res: Response) => {
  clearAdminCookie(res);
  res.status(204).end();
});

router.get("/admin/session", (req: Request, res: Response) => {
  res.json(
    GetAdminSessionResponse.parse({ authenticated: isAdmin(req.signedCookies) }),
  );
});

// ---------------------------------------------------------------------------
// Settings (singleton)
// ---------------------------------------------------------------------------

router.put(
  "/admin/settings",
  requireAdmin,
  async (req: Request, res: Response) => {
    const parsed = UpdateSettingsBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const [row] = await db
      .insert(settingsTable)
      .values({ id: 1, data: parsed.data })
      .onConflictDoUpdate({
        target: settingsTable.id,
        set: { data: parsed.data },
      })
      .returning();
    res.json(UpdateSettingsResponse.parse(row.data));
  },
);

// ---------------------------------------------------------------------------
// Generic CRUD for list resources
// ---------------------------------------------------------------------------

interface Zodish {
  safeParse: (v: unknown) => { success: boolean; data?: unknown };
  parse: (v: unknown) => unknown;
}

interface CrudSchemas {
  createBody: Zodish;
  updateBody: Zodish;
  createResponse: Zodish;
  updateResponse: Zodish;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function registerCrud(base: string, table: any, s: CrudSchemas): void {
  router.post(base, requireAdmin, async (req: Request, res: Response) => {
    const parsed = s.createBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const rows = (await db
      .insert(table)
      .values(parsed.data as Record<string, unknown>)
      .returning()) as Record<string, unknown>[];
    res.status(201).json(s.createResponse.parse(rows[0]));
  });

  router.patch(`${base}/:id`, requireAdmin, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const parsed = s.updateBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const values = parsed.data as Record<string, unknown>;
    let row: Record<string, unknown> | undefined;
    if (Object.keys(values).length === 0) {
      const rows = (await db
        .select()
        .from(table)
        .where(eq(table.id, id))) as Record<string, unknown>[];
      row = rows[0];
    } else {
      const rows = (await db
        .update(table)
        .set(values)
        .where(eq(table.id, id))
        .returning()) as Record<string, unknown>[];
      row = rows[0];
    }
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(s.updateResponse.parse(row));
  });

  router.delete(`${base}/:id`, requireAdmin, async (req: Request, res: Response) => {
    await db.delete(table).where(eq(table.id, Number(req.params.id)));
    res.status(204).end();
  });
}

registerCrud("/admin/stats", statsTable, {
  createBody: CreateStatBody,
  updateBody: UpdateStatBody,
  createResponse: CreateStatResponse,
  updateResponse: UpdateStatResponse,
});
registerCrud("/admin/platforms", platformsTable, {
  createBody: CreatePlatformBody,
  updateBody: UpdatePlatformBody,
  createResponse: CreatePlatformResponse,
  updateResponse: UpdatePlatformResponse,
});
registerCrud("/admin/videos", videosTable, {
  createBody: CreateVideoBody,
  updateBody: UpdateVideoBody,
  createResponse: CreateVideoResponse,
  updateResponse: UpdateVideoResponse,
});
registerCrud("/admin/shorts", shortsTable, {
  createBody: CreateShortBody,
  updateBody: UpdateShortBody,
  createResponse: CreateShortResponse,
  updateResponse: UpdateShortResponse,
});
registerCrud("/admin/demographics", demographicsTable, {
  createBody: CreateDemographicBody,
  updateBody: UpdateDemographicBody,
  createResponse: CreateDemographicResponse,
  updateResponse: UpdateDemographicResponse,
});
registerCrud("/admin/brands", brandsTable, {
  createBody: CreateBrandBody,
  updateBody: UpdateBrandBody,
  createResponse: CreateBrandResponse,
  updateResponse: UpdateBrandResponse,
});
registerCrud("/admin/jobs", jobsTable, {
  createBody: CreateJobBody,
  updateBody: UpdateJobBody,
  createResponse: CreateJobResponse,
  updateResponse: UpdateJobResponse,
});

// ---------------------------------------------------------------------------
// Media library
// ---------------------------------------------------------------------------

function serializeMedia(row: typeof mediaTable.$inferSelect) {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

router.get("/admin/media", requireAdmin, async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(mediaTable)
    .orderBy(desc(mediaTable.createdAt));
  res.json(ListMediaResponse.parse(rows.map(serializeMedia)));
});

router.post("/admin/media", requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreateMediaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [row] = await db.insert(mediaTable).values(parsed.data).returning();
  res.status(201).json(CreateMediaResponse.parse(serializeMedia(row)));
});

router.delete("/admin/media/:id", requireAdmin, async (req: Request, res: Response) => {
  await db.delete(mediaTable).where(eq(mediaTable.id, Number(req.params.id)));
  res.status(204).end();
});

export default router;
