import { useEffect, useMemo, useState } from "react";
import { FlatList, View, Text, Pressable } from "react-native";
import { Run } from "../../types/types";
import HistoryItem from "../../components/HistoryItem";
import db from "../../database/database";
import PageContainer from "../../components/PageContainer";
import { isDateGreaterOrEqual, isDateSmallerOrEqual } from "../../utils/utils";
import DateFilterDialog from "../../components/DateFilterDialog";
import { Entypo } from "@expo/vector-icons";

interface Filter {
  start: Date | undefined;
  end: Date | undefined;
}

export default function History() {
  const [runs, setRuns] = useState<Run[]>([]);
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
          isDateSmallerOrEqual(new Date(r.end), dateFilter.end)
      ),
    [dateFilter, runs]
  );

  useEffect(() => {
    db.getAllRuns()
      .then((runs) => setRuns(runs))
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        }
      });
  }, []);

  const handleDeleteItem = async (id: number) => {
    try {
      await db.deleteRun(id);
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

  const handleStartChange = (date: Date | undefined) => {
    if (date) setDateFilter({ ...dateFilter, start: date });
  };

  const handleEndChange = (date: Date | undefined) => {
    if (date) setDateFilter({ ...dateFilter, end: date });
  };

  const getDateRange = (): { start: Date; end: Date } => {
    // Pass down the current filter date if it exists, else the boundaries of
    // the runs; in case there is one run or less pass the current date

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

  const filterActive =
    dateFilter.start !== undefined || dateFilter.end !== undefined;

  return (
    <PageContainer>
      {runs.length === 0 ? (
        <View>
          <Text className="text-white">Keine Läufe</Text>
        </View>
      ) : (
        <>
          <View className="mb-4 flex flex-row justify-between">
            <Text className="text-orange-400 text-lg">
              {filteredRuns.length} Einträge
            </Text>
            <View style={{ gap: 8 }} className="flex flex-row items-center">
              {filterActive && (
                <Pressable
                  onPress={() =>
                    setDateFilter({ start: undefined, end: undefined })
                  }
                >
                  <Entypo name="cross" size={24} color="white" />
                </Pressable>
              )}
              <Pressable onPress={() => setFilterOpen(true)}>
                <Text className="text-white text-lg">Filter</Text>
              </Pressable>
            </View>
          </View>
          <FlatList
            data={filteredRuns}
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
          <DateFilterDialog
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            {...getDateRange()}
            onStartChange={handleStartChange}
            onEndChange={handleEndChange}
          />
        </>
      )}
    </PageContainer>
  );
}
