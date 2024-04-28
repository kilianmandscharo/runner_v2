import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Button from "../Button";

interface Props {
  nRuns: number;
  filterOpen: boolean;
  filterActive: boolean;
  onFilterOpen: () => void;
  onFilterClose: () => void;
  onFilderReset: () => void;
}

export default function HistoryHeader({
  nRuns,
  filterOpen,
  filterActive,
  onFilterOpen,
  onFilterClose,
  onFilderReset,
}: Props) {
  return (
    <View className="mb-8 flex flex-row justify-between items-center">
      <Text className="text-sky-300 text-lg">
        {nRuns} {nRuns === 1 ? "Eintrag" : "Einträge"}
      </Text>
      <View className="flex-row" style={{ gap: 8 }}>
        {filterOpen && filterActive && (
          <Button
            fontSize={14}
            height={38}
            width={100}
            onPress={onFilderReset}
            text="Zurücksetzen"
            variant="ghost"
          />
        )}
        <Button
          text="Filter"
          fontSize={18}
          height={38}
          width={108}
          onPress={filterOpen ? onFilterClose : onFilterOpen}
          icon={
            filterOpen ? (
              <FontAwesome name="eye-slash" size={20} color="white" />
            ) : (
              <FontAwesome name="eye" size={20} color="white" />
            )
          }
        />
      </View>
    </View>
  );
}
