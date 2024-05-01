import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Button from "../Button";

interface Props {
  filterOpen: boolean;
  filterActive: boolean;
  onFilterOpen: () => void;
  onFilterClose: () => void;
  onFilderReset: () => void;
}

export default function HistoryHeader({
  filterOpen,
  filterActive,
  onFilterOpen,
  onFilterClose,
  onFilderReset,
}: Props) {
  return (
    <View className="mb-6 flex flex-row justify-end items-center">
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
