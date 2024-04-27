import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Schema, history } from "./schema";
import { eq } from "drizzle-orm";
import { CurrentRunFull } from "../types/types";

export class HistoryDatabase {
  constructor(
    private db: ExpoSQLiteDatabase<Schema> | BetterSQLite3Database<Schema>,
  ) {}

  getDb() {
    return this.db;
  }

  async create(item: CurrentRunFull) {
    return await this.db.insert(history).values({
      start: item.start ?? "",
      end: item.end ?? "",
      time: item.time,
      distance: item.distance,
      path: JSON.stringify(item.path),
    });
  }

  async delete(id: number) {
    return await this.db.delete(history).where(eq(history.id, id));
  }

  async deleteAll() {
    return await this.db.delete(history);
  }

  async get(id: number) {
    const result = await this.db.query.history.findFirst({
      where: (history, { eq }) => eq(history.id, id),
    });
    return result ? { ...result, path: JSON.parse(result.path) } : undefined;
  }

  async getAll() {
    const rows = await this.db.query.history.findMany();
    return rows.map((item) => ({
      ...item,
      path: JSON.parse(item.path) as Location[],
    }));
  }
}
