import { View, Text, StyleSheet } from "react-native";
import { Run } from "../types/types";
import Button from "./Button";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  run: Run;
  onDelete: (id: number) => void;
}

export default function HistoryItem({ run, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{run.id}</Text>
      <Button
        onPress={onDelete}
        width={40}
        height={40}
        bg="red"
        icon={<AntDesign name="delete" size={24} color="white" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    width: 300,
    height: 50,
    borderRadius: 4,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  text: {
    color: "black",
  },
});
