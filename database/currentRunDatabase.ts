import * as SQLite from "expo-sqlite";
import * as schema from "./schema";
import { ExpoSQLiteDatabase, drizzle } from "drizzle-orm/expo-sqlite";
import { desc } from "drizzle-orm";
import { Location } from "../types/types";
import { calculateDistanceBetweenLocations } from "../utils/utils";
import { CurrentRun } from "./schema";

class CurrentRunDatabase {
  constructor(private db: ExpoSQLiteDatabase<typeof schema>) {}

  getDb() {
    return this.db;
  }

  async getCurrentRun() {
    return await this.db.query.currentRun.findFirst();
  }

  async getLocations() {
    return await this.db.query.location.findMany();
  }

  async getCurrentRunWithLocations() {
    const currentRun = await this.getCurrentRun();
    if (!currentRun) {
      return;
    }
    const locations = await this.getLocations();
    return {
      ...currentRun,
      path: locations,
    };
  }

  async getLastLocation() {
    return await this.db
      .select()
      .from(schema.location)
      .orderBy(desc(schema.location.id))
      .limit(1);
  }

  async getCurrentRunId() {
    const currentRun = await this.getCurrentRun();
    return currentRun?.id;
  }

  async getDistance() {
    const currentRun = await this.getCurrentRun();
    return currentRun?.distance ?? 0;
  }

  async createCurrentRun() {
    const currentRun = await this.getCurrentRun();
    if (currentRun) {
      throw new Error("current run already exists");
    }
    const result = await this.db
      .insert(schema.currentRun)
      .values({})
      .returning();
    return result[0];
  }

  private async addLocation(location: Location) {
    return await this.db.insert(schema.location).values(location);
  }

  async addLocations(locations: Location[]) {
    if (locations.length === 0) {
      return;
    }

    const lastLocation = await this.getLastLocation();
    const distance = calculateDistanceBetweenLocations(
      lastLocation.length === 1 ? [lastLocation[0], ...locations] : locations,
    );
    await this.updateDistance(distance);

    for (const location of locations) {
      await this.addLocation(location);
    }
  }

  async updateRun(update: Partial<CurrentRun>) {
    return await this.db.update(schema.currentRun).set(update);
  }

  private async updateDistance(distance: number) {
    const oldDistance = await this.getDistance();
    return await this.db
      .update(schema.currentRun)
      .set({ distance: oldDistance + distance });
  }

  async deleteCurrentRun() {
    await this.deleteLocations();
    return await this.db.delete(schema.currentRun);
  }

  private async deleteLocations() {
    return await this.db.delete(schema.location);
  }
}

const dbName = "current_run.db";
const client: SQLite.SQLiteDatabase = SQLite.openDatabaseSync(dbName);
const db = drizzle(client, { schema });
export const currentRunDb = new CurrentRunDatabase(db);

const testDbName = "current_run_test.db";
const testClient: SQLite.SQLiteDatabase = SQLite.openDatabaseSync(testDbName);
const testDb = drizzle(testClient, { schema });
export const currentRunTestDb = new CurrentRunDatabase(testDb);
