import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { schema } from "./schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { HistoryDatabase } from "./historyDatabase";
import { RunState } from "../types/types";

const sqlite = new Database(":memory:");
const db = drizzle(sqlite, { schema });
migrate(db, { migrationsFolder: "./drizzle/" });
const testDb = new HistoryDatabase(db);

describe("HistoryDatabase tests", () => {
  afterEach(async () => {
    await testDb.deleteAll();
  });

  describe("create tests", () => {
    it("should create the new history item", async () => {
      const result = await testDb.create({
        id: 1,
        start: new Date().toISOString(),
        end: new Date().toISOString(),
        time: 3600,
        distance: 10000,
        state: RunState.Finished,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });

      expect(result).toEqual({ changes: 1, lastInsertRowid: 1 });
    });
  });

  describe("get tests", () => {
    it("should return undefined if there is no item with the id", async () => {
      const result = await testDb.get(1);

      expect(result).toBe(undefined);
    });

    it("should return the history item", async () => {
      await testDb.create({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
        state: RunState.Finished,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });

      const result = await testDb.get(1);

      expect(result).toEqual({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
      });
    });
  });

  describe("getFull tests", () => {
    it("should return undefined if there is no item with the id", async () => {
      const result = await testDb.getFull(1);

      expect(result).toBe(undefined);
    });

    it("should return the full history item", async () => {
      await testDb.create({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
        state: RunState.Finished,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });

      const result = await testDb.getFull(1);

      expect(result).toEqual({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });
    });
  });

  describe("getAll tests", () => {
    it("should return and empty array if there is no item", async () => {
      const result = await testDb.getAll();

      expect(result).toEqual([]);
    });

    it("should return the history item in an array", async () => {
      await testDb.create({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
        state: RunState.Finished,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });

      const result = await testDb.getAll();

      expect(result).toEqual([
        {
          id: 1,
          start: "2024-04-27T11:06:29.224Z",
          end: "2024-04-27T11:06:29.224Z",
          time: 3600,
          distance: 10000,
        },
      ]);
    });
  });

  describe("getAllFull tests", () => {
    it("should return and empty array if there is no item", async () => {
      const result = await testDb.getAllFull();

      expect(result).toEqual([]);
    });

    it("should return the full history item in an array", async () => {
      await testDb.create({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
        state: RunState.Finished,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });

      const result = await testDb.getAllFull();

      expect(result).toEqual([
        {
          id: 1,
          start: "2024-04-27T11:06:29.224Z",
          end: "2024-04-27T11:06:29.224Z",
          time: 3600,
          distance: 10000,
          path: [
            {
              id: 1,
              timestamp: 1000,
              lon: 20,
              lat: 20,
              speed: 20,
              altitude: 500,
            },
          ],
        },
      ]);
    });
  });

  describe("delete tests", () => {
    it("should not delete if the item does not exist", async () => {
      const result = await testDb.delete(1);

      expect(result).toEqual({ changes: 0, lastInsertRowid: 1 });
    });

    it("should delete the item", async () => {
      await testDb.create({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
        state: RunState.Finished,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });

      const result = await testDb.delete(1);

      expect(result).toEqual({ changes: 1, lastInsertRowid: 1 });
    });
  });

  describe("deleteAll tests", () => {
    it("should not delete if no item exists", async () => {
      const result = await testDb.deleteAll();

      expect(result).toEqual({ changes: 0, lastInsertRowid: 1 });
    });

    it("should delete the items", async () => {
      await testDb.create({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
        state: RunState.Finished,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });
      await testDb.create({
        id: 1,
        start: "2024-04-27T11:06:29.224Z",
        end: "2024-04-27T11:06:29.224Z",
        time: 3600,
        distance: 10000,
        state: RunState.Finished,
        path: [
          {
            id: 1,
            timestamp: 1000,
            lon: 20,
            lat: 20,
            speed: 20,
            altitude: 500,
          },
        ],
      });

      const result = await testDb.deleteAll();

      expect(result).toEqual({ changes: 2, lastInsertRowid: 2 });
    });
  });
});
