import * as SQLite from "expo-sqlite";
import { Run } from "../types/types";

const DB_NAME = "data.db";

export class DatabaseConnector {
  private db: SQLite.Database = SQLite.openDatabase(DB_NAME);

  constructor() {
    this.init();
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

    this.executeTransaction(createTableQuery).catch((err) => {
      throw err;
    });
  }

  private executeTransaction(query: string, params: any[] = []): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            query,
            params,
            (_, resultSet) => {
              resolve(resultSet);
            },
            (err) => {
              reject(err);
              return false;
            }
          );
        },
        (err) => {
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

    try {
      const result = await this.executeTransaction(saveRunQuery, [
        start,
        end,
        time,
        distance,
        pathString,
      ]);
      const insertedId = result.insertId;
      return insertedId;
    } catch (err) {
      throw err;
    }
  }

  async deleteRun(runID: number): Promise<number> {
    const deleteRunQuery = `
    DELETE FROM run
    WHERE id = ?;
  `;

    try {
      const result = await this.executeTransaction(deleteRunQuery, [runID]);
      const rowsAffected = result.rowsAffected;
      return rowsAffected;
    } catch (err) {
      throw err;
    }
  }

  async getRun(runID: number): Promise<Run> {
    const getRunQuery = `
    SELECT * from run
    WHERE id = ?;
  `;

    try {
      const result = await this.executeTransaction(getRunQuery, [runID]);
      const run = result.rows.item(0);
      run.path = JSON.parse(run.path);
      return run;
    } catch (err) {
      throw err;
    }
  }

  async getAllRuns(): Promise<Run[]> {
    const getAllRunsQuery = `
    SELECT * FROM run;
  `;

    try {
      const result = await this.executeTransaction(getAllRunsQuery);
      const { rows } = result;
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

      return runs;
    } catch (err) {
      throw err;
    }
  }
}
