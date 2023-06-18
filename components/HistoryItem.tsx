import { View, Text } from "react-native";
import { Run } from "../types/types";
import Button from "./Button";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import Dialog from "./Dialog";

interface Props {
  run: Run;
  onDelete: () => void;
  onExport: () => Promise<void>;
}

export default function HistoryItem({ run, onDelete, onExport }: Props) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <View className="bg-rose-400 rounded-s justify-between items-center flex-row p-4">
      <Text className="text-white">{run.id}</Text>
      <View
        className="flex-1 flex-row justify-end items-center"
        style={{ gap: 8 }}
      >
        <Button
          onPress={onExport}
          width={40}
          height={40}
          bg="primary"
          icon={<AntDesign name="export" size={24} color="white" />}
        />
        <Button
          onPress={() => setDialogOpen(true)}
          width={40}
          height={40}
          bg="danger"
          icon={<AntDesign name="delete" size={24} color="white" />}
        />
      </View>
      <Dialog
        open={dialogOpen}
        text="Lauf löschen"
        onAccept={onDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </View>
  );
}
