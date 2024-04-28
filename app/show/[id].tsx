import { useEffect, useState } from "react";
import Map from "../../components/History/Map";
import PageContainer from "../../components/PageContainer";
import { useLocalSearchParams } from "expo-router";
import { HistoryRunFull } from "../../types/types";
import { historyDb } from "../../database";
import { logError } from "../../logger/logger";
import FullPageInfo from "../../components/FullPageInfo";

export default function ShowRun() {
  const { id } = useLocalSearchParams();
  const [run, setRun] = useState<HistoryRunFull>();

  useEffect(() => {
    historyDb
      .getFull(parseInt(id as string))
      .then(setRun)
      .catch((err) => logError("failed to fetch run for display", err));
  }, []);

  if (!run) {
    return <FullPageInfo text="Anzeigefehler" />;
  }

  if (run.path.length === 0) {
    return <FullPageInfo text="Kein Pfad vorhanden" />;
  }

  return (
    <PageContainer>
      <Map run={run} />
    </PageContainer>
  );
}
