import { View } from "react-native";
import Button from "../Button";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onDelete: () => void;
  onExport: () => void;
  onShowMap: () => void;
  onShowStats: () => void;
}

export default function HistoryItemControls({
  onDelete,
  onExport,
  onShowMap,
  onShowStats,
}: Props) {
  return (
    <View>
      <View className="flex" style={{ gap: 12 }}>
        <View className="flex flex-row" style={{ gap: 12 }}>
          <Button
            onPress={onShowStats}
            width={40}
            height={40}
            icon={<Ionicons name="stats-chart" size={24} color="white" />}
          />
          <Button
            onPress={onExport}
            width={40}
            height={40}
            bg="primary"
            icon={<AntDesign name="export" size={24} color="white" />}
          />
        </View>
        <View className="flex flex-row" style={{ gap: 12 }}>
          <Button
            onPress={onShowMap}
            width={40}
            height={40}
            icon={
              <MaterialCommunityIcons
                name="map-marker-path"
                size={24}
                color="white"
              />
            }
          />
          <Button
            onPress={onDelete}
            width={40}
            height={40}
            bg="danger"
            icon={<AntDesign name="delete" size={24} color="white" />}
          />
        </View>
      </View>
    </View>
  );
}
