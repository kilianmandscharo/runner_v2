import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { DatabaseConnector } from "../../database/database";
import { Run } from "../../types/types";
import PageContainer from "../../components/PageContainer";
import HistoryItem from "../../components/HistoryItem";

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

  const handleExportRun = async (_: Run) => {
    // TODO: Implement parsing and saving to disk correctly
  };

  return (
    <PageContainer>
      <FlatList
        data={runs}
        renderItem={({ item: r }) => (
          <HistoryItem
            key={r.id}
            run={r}
            onDelete={() => handleDeleteItem(r.id)}
            onExport={() => handleExportRun(r)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </PageContainer>
  );
}
