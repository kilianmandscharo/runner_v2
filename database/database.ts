import * as SQLite from "expo-sqlite";
import { Run } from "../types/types";

const DB_NAME = "data.db";

export class DatabaseConnector {
  private db: SQLite.Database | null = null;

  constructor() {
    this.open();
    this.init();
  }

  private open() {
    this.db = SQLite.openDatabase(DB_NAME);
  }

  private init() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS run (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      time INTEGER NOT NULL,
      distance REAL NOT NULL,
      path TEXT NOT NULL
    );
  `;

    return new Promise<void>((resolve, reject) => {
      this.db?.transaction(
        (tx) => {
          tx.executeSql(
            createTableQuery,
            [],
            () => {
              console.log("Table created successfully");
              resolve();
            },
            (err) => {
              console.log("Error while creating the table:", err);
              reject(err);
              return false;
            }
          );
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  async saveRun(run: Run): Promise<number | undefined> {
    const saveRunQuery = `
    INSERT INTO run (start, end, time, distance, path)
    VALUES (?, ?, ?, ?, ?);
  `;

    const { start, end, time, distance, path } = run;
    const pathString = JSON.stringify(path);

    return new Promise<number | undefined>((resolve, reject) => {
      this.db?.transaction(
        (tx) => {
          tx.executeSql(
            saveRunQuery,
            [start, end, time, distance, pathString],
            (_, resultSet) => {
              console.log("Run saved successfully");
              const insertedId = resultSet.insertId;
              resolve(insertedId);
            },
            (err) => {
              console.log("Error saving run:", err);
              reject(err);
              return false;
            }
          );
        },
        (err) => {
          console.log("Transaction error:", err);
          reject(err);
        }
      );
    });
  }

  async deleteRun(runId: number): Promise<number> {
    const deleteRunQuery = `
    DELETE FROM run
    WHERE id = ?;
  `;

    return new Promise<number>((resolve, reject) => {
      this.db?.transaction(
        (tx) => {
          tx.executeSql(
            deleteRunQuery,
            [runId],
            (_, resultSet) => {
              console.log("Run deleted successfully");
              const rowsAffected = resultSet.rowsAffected;
              resolve(rowsAffected);
            },
            (err) => {
              console.log("Error deleting run:", err);
              reject(err);
              return false;
            }
          );
        },
        (err) => {
          console.log("Transaction error:", err);
          reject(err);
        }
      );
    });
  }

  async getAllRuns(): Promise<Run[]> {
    const getAllRunsQuery = `
    SELECT * FROM run;
  `;

    return new Promise<Run[]>((resolve, reject) => {
      this.db?.transaction(
        (tx) => {
          tx.executeSql(
            getAllRunsQuery,
            [],
            (_, resultSet) => {
              const { rows } = resultSet;
              const runs: Run[] = [];

              for (let i = 0; i < rows.length; i++) {
                const { id, start, end, time, distance, path } = rows.item(i);
                const parsedPath = JSON.parse(path);
                const run: Run = {
                  id,
                  start,
                  end,
                  time,
                  distance,
                  path: parsedPath,
                };
                runs.push(run);
              }

              resolve(runs);
            },
            (err) => {
              console.log("Error retrieving runs:", err);
              reject(err);
              return false;
            }
          );
        },
        (err) => {
          console.log("Transaction error:", err);
          reject(err);
        }
      );
    });
  }
}
