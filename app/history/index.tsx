import { useEffect, useState } from "react";
import { View } from "react-native";
import HistoryItem from "../../components/HistoryItem";
import { DatabaseConnector } from "../../database/database";
import { Run } from "../../types/types";
import * as GPXParser from "../../parser/gpxParser";
import PageContainer from "../../components/PageContainer";

const dbConnector = new DatabaseConnector();

export default function History() {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    dbConnector
      .getAllRuns()
      .then((runs) => setRuns(runs))
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        }
      });
  }, []);

  const handleDeleteItem = async (id: number) => {
    try {
      await dbConnector.deleteRun(id);
      setRuns(runs.filter((r) => r.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
    }
  };

  const handleExportRun = async (run: Run) => {
    await GPXParser.parseAndSaveToDisk(run);
    try {
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
    }
  };

  return (
    <PageContainer>
      <View className="flex-1 justify-center items-center" style={{ gap: 16 }}>
        {runs.map((r) => (
          <HistoryItem
            key={r.id}
            run={r}
            onDelete={() => handleDeleteItem(r.id)}
            onExport={() => handleExportRun(r)}
          />
        ))}
      </View>
    </PageContainer>
  );
}
