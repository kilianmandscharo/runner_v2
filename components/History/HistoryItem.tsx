import { View, Text } from "react-native";
import { HistoryRunPartial } from "../../types/types";
import Button from "../Button";
import { useState } from "react";
import Dialog from "../Dialog/Dialog";
import dayjs from "dayjs";
import { formatTime, getTimeFromSeconds } from "../../utils/utils";
import Divider from "../Divider";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../assets/colors";
import HistoryItemControls from "./HistoryItemControls";

interface Props {
  run: HistoryRunPartial;
  onDelete: () => void;
  onExport: () => void;
  onShowMap: () => void;
  onShowStats: () => void;
}

export default function HistoryItem({
  run,
  onDelete,
  onExport,
  onShowMap,
  onShowStats,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const date = dayjs(run.start).format("DD.MM.YYYY");
  const startTime = dayjs(run.start).format("HH:mm");
  const endTime = dayjs(run.end).format("HH:mm");

  return (
    <View className="bg-slate-600 rounded justify-between items-center flex-row p-3 mb-4">
      <View className="flex" style={{ gap: 12 }}>
        <View>
          <Text className="text-white text-lg font-bold">{date}</Text>
          <Text className="text-white">
            {startTime} - {endTime}
          </Text>
        </View>
        <Divider />
        <View className="flex flex-row" style={{ gap: 12 }}>
          <View className="flex flex-row gap-2 items-center">
            <FontAwesome5
              name="shoe-prints"
              size={18}
              color={colors.sky["200"]}
            />
            <Text className="text-white text-lg">
              {Math.floor(run.distance) / 1000} km
            </Text>
          </View>
          <View className="flex flex-row gap-2 items-center">
            <Entypo name="stopwatch" size={20} color={colors.sky["200"]} />
            <Text className="text-white text-lg">
              {formatTime(getTimeFromSeconds(run.time))}
            </Text>
          </View>
        </View>
      </View>
      <HistoryItemControls
        onDelete={() => setDialogOpen(true)}
        onExport={onExport}
        onShowMap={onShowMap}
        onShowStats={onShowStats}
      />
      <Dialog
        open={dialogOpen}
        text="Lauf löschen"
        acceptButton={<Button bg="danger" text="Weiter" onPress={onDelete} />}
        cancelButton={
          <Button
            text="Abbrechen"
            variant="secondary"
            onPress={() => setDialogOpen(false)}
          />
        }
      />
    </View>
  );
}
