import { FlatList } from "react-native";
import HistoryItem from "./HistoryItem";
import { HistoryRunPartial } from "../../types/types";

interface Props {
  onDeleteItem: (id: number) => void;
  onExportItem: (id: number) => void;
  onShowMap: (id: number) => void;
  onShowStats: (id: number) => void;
  filteredRuns: HistoryRunPartial[];
}

export default function HistoryList({
  filteredRuns,
  onDeleteItem,
  onExportItem,
  onShowMap,
  onShowStats,
}: Props) {
  return (
    <FlatList
      data={filteredRuns}
      renderItem={({ item: r }) => (
        <HistoryItem
          key={r.id}
          run={r}
          onDelete={() => onDeleteItem(r.id)}
          onExport={() => onExportItem(r.id)}
          onShowMap={() => onShowMap(r.id)}
          onShowStats={() => onShowStats(r.id)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
