import { Modal, View, Text } from "react-native";
import Button from "./Button";

interface Props {
  open: boolean;
  text: string;
  onAccept: () => void;
  onCancel: () => void;
}

export default function Dialog({ open, text, onAccept, onCancel }: Props) {
  return (
    <Modal visible={open} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-transparent">
        <View className="h-2/5 w-11/12 justify-between items-center p-8 rounded-s bg-slate-700">
          <Text className="text-3xl text-white">{text}</Text>
          <View style={{ gap: 16 }}>
            <Button text="Abbrechen" onPress={onCancel} />
            <Button bg="danger" text="Weiter" onPress={onAccept} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
