import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { Schema, CurrentRunFull, history, Location } from "./schema";
import { eq } from "drizzle-orm";

export class HistoryDatabase {
  constructor(private db: ExpoSQLiteDatabase<Schema>) {}

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

  async get(id: number) {
    return await this.db.query.history.findFirst({
      where: (history, { eq }) => eq(history.id, id),
    });
  }

  async getAll() {
    const rows = await this.db.query.history.findMany();
    return rows.map((item) => ({
      ...item,
      path: JSON.parse(item.path) as Location[],
    }));
  }
}
