import { CurrentRunDatabase } from "./currentRunDatabase";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { schema } from "./schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database(":memory:");
const db = drizzle(sqlite, { schema });
migrate(db, { migrationsFolder: "./drizzle/" });
const testDb = new CurrentRunDatabase(db);

describe("CurrentRunDatabase tests", () => {
  afterEach(async () => {
    await testDb.deleteRun();
  });

  describe("createRun tests", () => {
    it("should create the current run", async () => {
      const result = await testDb.createRun();

      expect(result).toEqual({
        id: 1,
        start: null,
        end: null,
        time: 0,
        distance: 0,
        state: "Prestart",
      });
    });

    it("should throw if the current run already exists", async () => {
      try {
        await testDb.createRun();
      } catch (error) {
        expect(error).toEqual(new Error("current run already exists"));
      }
    });
  });

  describe("getRun tests", () => {
    it("should return undefined if there is no current run", async () => {
      const result = await testDb.getRun();

      expect(result).toBe(undefined);
    });

    it("should return the current run", async () => {
      await testDb.createRun();

      const result = await testDb.getRun();

      expect(result).toEqual({
        id: 1,
        start: null,
        end: null,
        time: 0,
        distance: 0,
        state: "Prestart",
      });
    });
  });

  describe("getId tests", () => {
    it("should return undefined if there is no current run", async () => {
      const result = await testDb.getId();

      expect(result).toBe(undefined);
    });

    it("should return the current run id", async () => {
      await testDb.createRun();

      const result = await testDb.getId();

      expect(result).toBe(1);
    });
  });

  describe("getDistance tests", () => {
    it("should return 0 if there is no current run", async () => {
      const result = await testDb.getDistance();

      expect(result).toBe(0);
    });

    it("should return the current distance", async () => {
      await testDb.createRun();

      const result = await testDb.getDistance();

      expect(result).toBe(0);
    });
  });

  describe("updateRun tests", () => {
    it("should not update if there is no current run", async () => {
      const result = await testDb.updateRun({ distance: 10, time: 10 });

      expect(result).toEqual({ changes: 0, lastInsertRowid: 1 });
    });

    it("should update the current run", async () => {
      await testDb.createRun();

      const result = await testDb.updateRun({ distance: 10, time: 10 });

      expect(result).toEqual({ changes: 1, lastInsertRowid: 1 });
    });
  });

  describe("addLocation tests", () => {
    it("should add the locations", async () => {
      let result = await testDb.addLocation({
        timestamp: new Date().getMilliseconds(),
        lon: 20,
        lat: 20,
        speed: 10,
        altitude: 500,
      });

      expect(result).toEqual({ changes: 1, lastInsertRowid: 1 });

      result = await testDb.addLocation({
        timestamp: new Date().getMilliseconds(),
        lon: 20,
        lat: 20,
        speed: 10,
        altitude: 500,
      });

      expect(result).toEqual({ changes: 1, lastInsertRowid: 2 });
    });
  });

  describe("getRunWithLocations tests", () => {
    it("should return undefined if there is no run", async () => {
      const result = await testDb.getRunWithLocations();

      expect(result).toBe(undefined);
    });

    it("should return the run with locations", async () => {
      await testDb.createRun();
      await testDb.addLocation({
        timestamp: 100000000,
        lon: 20,
        lat: 20,
        speed: 10,
        altitude: 500,
      });

      const result = await testDb.getRunWithLocations();

      expect(result).toEqual({
        id: 1,
        start: null,
        end: null,
        time: 0,
        distance: 0,
        state: "Prestart",
        path: [
          {
            altitude: 500,
            id: 1,
            lat: 20,
            lon: 20,
            speed: 10,
            timestamp: 100000000,
          },
        ],
      });
    });
  });

  describe("getRunWithLocations tests", () => {
    it("should return undefined if there is no run", async () => {
      const result = await testDb.getRunWithLocations();

      expect(result).toBe(undefined);
    });

    it("should return the run with locations", async () => {
      await testDb.createRun();
      await testDb.addLocation({
        timestamp: 100000000,
        lon: 20,
        lat: 20,
        speed: 10,
        altitude: 500,
      });

      const result = await testDb.getRunWithLocations();

      expect(result).toEqual({
        id: 1,
        start: null,
        end: null,
        time: 0,
        distance: 0,
        state: "Prestart",
        path: [
          {
            altitude: 500,
            id: 1,
            lat: 20,
            lon: 20,
            speed: 10,
            timestamp: 100000000,
          },
        ],
      });
    });
  });

  describe("deleteRun tests", () => {
    it("should not delete if there is no current run", async () => {
      const result = await testDb.deleteRun();

      expect(result).toEqual({ changes: 0, lastInsertRowid: 1 });
    });

    it("should delete the current run and all locations", async () => {
      await testDb.createRun();
      await testDb.addLocation({
        timestamp: 100000000,
        lon: 20,
        lat: 20,
        speed: 10,
        altitude: 500,
      });

      const result = await testDb.deleteRun();

      expect(result).toEqual({ changes: 2, lastInsertRowid: 1 });
    });
  });
});
