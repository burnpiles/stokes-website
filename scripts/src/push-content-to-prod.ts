/**
 * Push all site content from the development database to the live (production)
 * site via its admin API.
 *
 * WARNING: this overwrites ALL content on the live site (settings, stats,
 * platforms, videos, shorts, demographics, brands, press, jobs) with the
 * current development content. Any edits made directly on the live /admin
 * are lost.
 *
 * Usage:
 *   PROD_URL=https://stokesuniverse.com pnpm --filter @workspace/scripts run push-content-to-prod
 * or:
 *   pnpm --filter @workspace/scripts run push-content-to-prod -- https://stokesuniverse.com
 */

const DEV_BASE = "http://localhost:80";

const LIST_RESOURCES = [
  "stats",
  "platforms",
  "videos",
  "shorts",
  "demographics",
  "brands",
  "press",
  "jobs",
] as const;

type ListResource = (typeof LIST_RESOURCES)[number];

interface ContentPayload extends Record<ListResource, Record<string, unknown>[]> {
  settings: Record<string, unknown>;
}

function prodBase(): string {
  const fromArg = process.argv.slice(2).find((a) => a !== "--");
  const fromEnv = process.env.PROD_URL;
  const raw = (fromArg ?? fromEnv ?? "").trim();
  if (!raw) {
    throw new Error(
      "Pass the live site URL: PROD_URL=https://stokesuniverse.com or as the first argument. " +
        "(Do NOT use REPLIT_DOMAINS — inside the dev container it points at the development preview.)",
    );
  }
  const url = raw.startsWith("http") ? raw : `https://${raw}`;
  const host = new URL(url).host;
  if (host.endsWith(".replit.dev")) {
    throw new Error(
      `${host} is a development preview domain, not the live site. Refusing to push.`,
    );
  }
  return url.replace(/\/+$/, "");
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${init?.method ?? "GET"} ${url} → ${res.status} ${body}`);
  }
  return (await res.json()) as T;
}

async function login(base: string): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set.");
  const res = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    throw new Error(`Login to ${base} failed with status ${res.status}`);
  }
  const cookies = res.headers.getSetCookie();
  if (cookies.length === 0) {
    throw new Error("Login succeeded but no session cookie was returned.");
  }
  return cookies.map((c) => c.split(";")[0]).join("; ");
}

async function main(): Promise<void> {
  const prod = prodBase();
  console.log(`Pushing development content → ${prod}`);

  const dev = await fetchJson<ContentPayload>(`${DEV_BASE}/api/content`);
  const cookie = await login(prod);
  const authed = (extra?: RequestInit): RequestInit => ({
    ...extra,
    headers: {
      Cookie: cookie,
      "Content-Type": "application/json",
      ...(extra?.headers ?? {}),
    },
  });

  // 1. Settings (singleton upsert — safe to do first).
  await fetchJson(
    `${prod}/api/admin/settings`,
    authed({ method: "PUT", body: JSON.stringify(dev.settings) }),
  );
  console.log("✓ settings");

  // 2. List resources: delete everything on prod, then recreate from dev.
  const prodContent = await fetchJson<ContentPayload>(`${prod}/api/content`);

  // Safety net: snapshot the live content before overwriting it.
  const { mkdir, writeFile } = await import("node:fs/promises");
  const backupDir = new URL("../backups/", import.meta.url);
  await mkdir(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = new URL(`prod-content-${stamp}.json`, backupDir);
  await writeFile(backupFile, JSON.stringify(prodContent, null, 2));
  console.log(`✓ backed up current live content to ${backupFile.pathname}`);

  for (const resource of LIST_RESOURCES) {
    const existing = prodContent[resource] ?? [];
    for (const row of existing) {
      const res = await fetch(
        `${prod}/api/admin/${resource}/${row.id}`,
        authed({ method: "DELETE" }),
      );
      if (!res.ok && res.status !== 404) {
        throw new Error(
          `DELETE ${resource}/${row.id} failed with status ${res.status}`,
        );
      }
    }

    let created = 0;
    for (const row of dev[resource] ?? []) {
      const { id: _id, ...body } = row;
      await fetchJson(
        `${prod}/api/admin/${resource}`,
        authed({ method: "POST", body: JSON.stringify(body) }),
      );
      created += 1;
    }
    console.log(
      `✓ ${resource} (removed ${existing.length}, created ${created})`,
    );
  }

  console.log("Done. Live site content now matches development.");
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
