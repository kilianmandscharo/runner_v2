import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { CurrentRunDatabase } from "./currentRunDatabase";
import { schema } from "./schema";
import { HistoryDatabase } from "./historyDatabase";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";

const dbName = "run.db";
const client: SQLite.SQLiteDatabase = SQLite.openDatabaseSync(dbName);
const db = drizzle(client, { schema });
migrate(db, migrations);

export const currentRunDb = new CurrentRunDatabase(db);
export const historyDb = new HistoryDatabase(db);
