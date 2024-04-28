import { useEffect, useMemo, useState } from "react";
import { HistoryRunPartial } from "../../types/types";
import PageContainer from "../../components/PageContainer";
import { isDateGreaterOrEqual, isDateSmallerOrEqual } from "../../utils/utils";
import FullPageInfo from "../../components/FullPageInfo";
import { historyDb } from "../../database";
import { logError } from "../../logger/logger";
import HistoryList from "../../components/History/HistoryList";
import DateFilter from "../../components/History/DateFilter";
import HistoryHeader from "../../components/History/HistoryHeader";
import { useRouter } from "expo-router";

interface Filter {
  start: Date | undefined;
  end: Date | undefined;
}

export default function History() {
  const router = useRouter();

  const [runs, setRuns] = useState<HistoryRunPartial[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<Filter>({
    start: undefined,
    end: undefined,
  });

  const filteredRuns = useMemo(
    () =>
      runs.filter(
        (r) =>
          isDateGreaterOrEqual(new Date(r.start), dateFilter.start) &&
          isDateSmallerOrEqual(new Date(r.end), dateFilter.end),
      ),
    [dateFilter, runs],
  );

  useEffect(() => {
    historyDb
      .getAll()
      .then(setRuns)
      .catch((err) => logError("failed to fetch history items", err));
  }, []);

  const handleDeleteItem = async (id: number) => {
    try {
      await historyDb.delete(id);
      setRuns(runs.filter((r) => r.id !== id));
    } catch (err) {
      logError("failed to delete history item", err);
    }
  };

  const handleExportItem = async (id: number) => {
    // TODO: Implement parsing and saving to disk correctly
    console.log(id);
  };

  const handleShowMap = (id: number) => {
    router.push(`/show/${id}`);
  };

  const handleShowStats = (id: number) => {
    // TODO: Implement showing stats
    console.log(id);
  };

  const handleStartChange = (date: Date | undefined) => {
    if (date) setDateFilter({ ...dateFilter, start: date });
  };

  const handleEndChange = (date: Date | undefined) => {
    if (date) setDateFilter({ ...dateFilter, end: date });
  };

  const getDateRange = (): { start: Date; end: Date } => {
    let start: Date;
    if (dateFilter.start !== undefined) {
      start = dateFilter.start;
    } else {
      start = runs.length > 1 ? new Date(runs[0].start) : new Date();
    }

    let end: Date;
    if (dateFilter.end !== undefined) {
      end = dateFilter.end;
    } else {
      end = runs.length > 1 ? new Date(runs[runs.length - 1].end) : new Date();
    }

    return {
      start,
      end,
    };
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleFilterOpen = () => {
    setFilterOpen(true);
  };

  const handleFilterReset = () => {
    setDateFilter({ start: undefined, end: undefined });
  };

  if (runs.length === 0) {
    return <FullPageInfo text="Keine gespeicherten Einträge" />;
  }

  const filterActive =
    dateFilter.start !== undefined || dateFilter.end !== undefined;

  return (
    <PageContainer>
      <HistoryHeader
        nRuns={filteredRuns.length}
        filterOpen={filterOpen}
        filterActive={filterActive}
        onFilterOpen={handleFilterOpen}
        onFilterClose={handleFilterClose}
        onFilderReset={handleFilterReset}
      />
      {filterOpen && (
        <DateFilter
          {...getDateRange()}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
        />
      )}
      <HistoryList
        filteredRuns={filteredRuns}
        onDeleteItem={handleDeleteItem}
        onExportItem={handleExportItem}
        onShowMap={handleShowMap}
        onShowStats={handleShowStats}
      />
    </PageContainer>
  );
}
