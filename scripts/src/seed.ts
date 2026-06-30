import {
  db,
  pool,
  settingsTable,
  statsTable,
  platformsTable,
  videosTable,
  shortsTable,
  demographicsTable,
  brandsTable,
  jobsTable,
  defaultSettings,
  seedStats,
  seedPlatforms,
  seedVideos,
  seedShorts,
  seedDemographics,
  seedBrands,
  seedJobs,
} from "@workspace/db";

async function main(): Promise<void> {
  console.log("Seeding database...");

  await db.delete(statsTable);
  await db.delete(platformsTable);
  await db.delete(videosTable);
  await db.delete(shortsTable);
  await db.delete(demographicsTable);
  await db.delete(brandsTable);
  await db.delete(jobsTable);

  await db
    .insert(settingsTable)
    .values({ id: 1, data: defaultSettings })
    .onConflictDoUpdate({
      target: settingsTable.id,
      set: { data: defaultSettings },
    });

  await db.insert(statsTable).values(seedStats);
  await db.insert(platformsTable).values(seedPlatforms);
  await db.insert(videosTable).values(seedVideos);
  await db.insert(shortsTable).values(seedShorts);
  await db.insert(demographicsTable).values(seedDemographics);
  await db.insert(brandsTable).values(seedBrands);
  await db.insert(jobsTable).values(seedJobs);

  console.log("Seed complete.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
