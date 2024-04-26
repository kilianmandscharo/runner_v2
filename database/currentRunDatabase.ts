import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { desc } from "drizzle-orm";
import { calculateDistanceBetweenLocations } from "../utils/utils";
import { CurrentRun, Location, Schema, location, run } from "./schema";

export class CurrentRunDatabase {
  constructor(private db: ExpoSQLiteDatabase<Schema>) {}

  getDb() {
    return this.db;
  }

  async getCurrentRun() {
    return await this.db.query.run.findFirst();
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
      .from(location)
      .orderBy(desc(location.id))
      .limit(1);
  }

  async getCurrentRunId() {
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

  async createCurrentRun() {
    const currentRun = await this.getCurrentRun();
    if (currentRun) {
      throw new Error("current run already exists");
    }
    const result = await this.db.insert(run).values({}).returning();
    return result[0];
  }

  private async addLocation(loc: Omit<Location, "id">) {
    return await this.db.insert(location).values(loc);
  }

  async addLocations(locations: Omit<Location, "id">[]) {
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
    return await this.db.update(run).set(update);
  }

  private async updateDistance(distance: number) {
    const oldDistance = await this.getDistance();
    return await this.db.update(run).set({ distance: oldDistance + distance });
  }

  async deleteCurrentRun() {
    await this.deleteLocations();
    return await this.db.delete(run);
  }

  private async deleteLocations() {
    return await this.db.delete(location);
  }
}
