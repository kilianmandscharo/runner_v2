import { View, Text } from "react-native";
import { Run } from "../types/types";
import Button from "./Button";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import Dialog from "./Dialog";
import { useRouter } from "expo-router";

interface Props {
  run: Run;
  onDelete: () => void;
  onExport: () => Promise<void>;
}

export default function HistoryItem({ run, onDelete, onExport }: Props) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <View className="bg-slate-600 rounded justify-between items-center flex-row p-4 m-2">
      <Text className="text-white">{run.id}</Text>
      <View
        className="flex-1 flex-row justify-end items-center"
        style={{ gap: 8 }}
      >
        <Button
          onPress={() => router.push(`/show/${run.id}`)}
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
