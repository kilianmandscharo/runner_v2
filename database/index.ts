import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { CurrentRunDatabase } from "./currentRunDatabase";
import { schema } from "./schema";
import { HistoryDatabase } from "./historyDatabase";

const dbName = "run.db";
const client: SQLite.SQLiteDatabase = SQLite.openDatabaseSync(dbName);
const db = drizzle(client, { schema });

export const currentRunDb = new CurrentRunDatabase(db);
export const historyDb = new HistoryDatabase(db);

const testDbName = "run_test.db";
const testClient: SQLite.SQLiteDatabase = SQLite.openDatabaseSync(testDbName);
const testDb = drizzle(testClient, { schema });

export const currentRunTestDb = new CurrentRunDatabase(testDb);
export const historyTestDb = new HistoryDatabase(testDb);
