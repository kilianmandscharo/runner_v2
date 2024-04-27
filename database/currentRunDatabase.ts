import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { desc } from "drizzle-orm";
import { calculatePointDistance } from "../utils/utils";
import { Schema, location, run } from "./schema";
import { CurrentRun, Location } from "../types/types";

export class CurrentRunDatabase {
  constructor(
    private db: ExpoSQLiteDatabase<Schema> | BetterSQLite3Database<Schema>,
  ) {}

  getDb() {
    return this.db;
  }

  async getRun() {
    return await this.db.query.run.findFirst();
  }

  private async getLocations() {
    return await this.db.query.location.findMany();
  }

  async getRunWithLocations() {
    const currentRun = await this.getRun();
    if (!currentRun) {
      return;
    }
    const locations = await this.getLocations();
    return {
      ...currentRun,
      path: locations,
    };
  }

  private async getLastLocation() {
    const result = await this.db
      .select()
      .from(location)
      .orderBy(desc(location.id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async getId() {
    const result = await this.db.query.run.findFirst({
      columns: {
        id: true,
      },
    });
    return result?.id;
  }

  async getDistance() {
    const result = await this.db.query.run.findFirst({
      columns: {
        distance: true,
      },
    });
    return result?.distance ?? 0;
  }

  async createRun() {
    const currentRun = await this.getRun();
    if (currentRun) {
      throw new Error("current run already exists");
    }
    const result = await this.db.insert(run).values({}).returning();
    return result[0];
  }

  async addLocation(newLocation: Omit<Location, "id">) {
    const lastLocation = await this.getLastLocation();
    const distance = lastLocation
      ? calculatePointDistance(lastLocation, newLocation)
      : 0;
    await this.updateDistance(distance);
    return await this.db.insert(location).values(newLocation);
  }

  async updateRun(update: Partial<CurrentRun>) {
    return await this.db.update(run).set(update);
  }

  private async updateDistance(distance: number) {
    const oldDistance = await this.getDistance();
    return await this.db.update(run).set({ distance: oldDistance + distance });
  }

  async deleteRun() {
    const locationsResult = await this.deleteLocations();
    const runResult = await this.db.delete(run);
    return {
      ...runResult,
      changes: runResult.changes + locationsResult.changes,
    };
  }

  private async deleteLocations() {
    return await this.db.delete(location);
  }
}
