import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import HistoryItem from "../../components/HistoryItem";
import { DatabaseConnector } from "../../database/database";
import { Run } from "../../types/types";

const dbConnector = new DatabaseConnector();

export default function History() {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    dbConnector
      .getAllRuns()
      .then((runs) => setRuns(runs))
      .catch((e) => console.log(e));
  }, []);

  const handleDeleteItem = async (id: number) => {
    try {
      await dbConnector.deleteRun(id);
      setRuns(runs.filter((r) => r.id !== id));
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
    }
  };

  return (
    <View style={styles.container}>
      {runs.map((r) => (
        <HistoryItem
          key={r.id}
          run={r}
          onDelete={() => handleDeleteItem(r.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
