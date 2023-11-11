import { useLocalSearchParams } from "expo-router/src/LocationProvider";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Map from "../../components/Map";
import PageContainer from "../../components/PageContainer";
import { DatabaseConnector } from "../../database/database";
import { Run } from "../../types/types";

const dbConnector = new DatabaseConnector();

export default function ShowRun() {
  const { id } = useLocalSearchParams();
  const [run, setRun] = useState<Run | null>(null);

  useEffect(() => {
    dbConnector.getRun(parseInt(id as string)).then((run) => {
      setRun(run);
    });
  }, []);

  return (
    <PageContainer>
      {run?.path.length === 0 ? (
        <View>
          <Text>Kein Pfad vorhanden</Text>
        </View>
      ) : (
        <Map run={run} />
      )}
    </PageContainer>
  );
}
