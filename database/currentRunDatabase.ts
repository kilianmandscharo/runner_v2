import * as SQLite from "expo-sqlite";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { desc, eq } from "drizzle-orm";
import { RunState, Location } from "../types/types";
import { calculateDistanceBetweenLocations } from "../utils/utils";

const client: SQLite.SQLiteDatabase = SQLite.openDatabaseSync("current_run.db");

export const db = drizzle(client, { schema });

export async function getCurrentRun() {
  return await db.query.currentRun.findFirst();
}

// async function getCurrentRunWithLocations() {
//   const currentRun = await getCurrentRun();
//   if (currentRun) {
//     const locations = await db.query.location.findMany();
//     return {
//       ...currentRun,
//       path: locations,
//     };
//   }
// }

export async function updateRun(time: number, state: RunState) {
  return await db
    .update(schema.currentRun)
    .set({ time, state })
    .where(eq(schema.currentRun.id, 1));
}

export async function createCurrentRun() {
  const result = await db.insert(schema.currentRun).values({}).returning();
  return result[0];
}

export async function deleteCurrentRun() {
  return await db.delete(schema.currentRun).where(eq(schema.currentRun.id, 1));
}

async function getLastLocation() {
  return await db
    .select()
    .from(schema.location)
    .orderBy(desc(schema.currentRun.id))
    .limit(1);
}

export async function getDistance() {
  const result = await db
    .select({ distance: schema.currentRun.distance })
    .from(schema.currentRun)
    .where(eq(schema.currentRun.id, 1));
  return result.length > 0 ? result[0].distance : 0;
}

async function updateDistance(distance: number) {
  const currentRun = await getCurrentRun();
  const oldDistance = currentRun?.distance ?? 0;
  return await db
    .update(schema.currentRun)
    .set({ distance: oldDistance + distance })
    .where(eq(schema.currentRun.id, 1));
}

async function addLocation(location: Location) {
  return await db.insert(schema.location).values({
    ...location,
    currentRunId: 1,
  });
}

export async function addLocations(locations: Location[]) {
  if (locations.length === 0) {
    return;
  }

  const lastLocation = await getLastLocation();
  if (lastLocation.length === 1) {
    locations = [lastLocation[0], ...locations];
  }

  const distance = calculateDistanceBetweenLocations(locations);
  await updateDistance(distance);

  for (const location of locations) {
    await addLocation(location);
  }
}
