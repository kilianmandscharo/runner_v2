import { Modal, View, Text } from "react-native";

interface Props {
  open: boolean;
  text: string;
  acceptButton?: JSX.Element;
  cancelButton?: JSX.Element;
}

export default function Dialog({
  open,
  text,
  acceptButton,
  cancelButton,
}: Props) {
  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-slate-700/60">
        <View
          style={{ gap: 32 }}
          className="h-fit w-11/12 justify-between items-center p-8 rounded-s bg-slate-700"
        >
          <Text className="text-2xl text-white">{text}</Text>
          <View style={{ gap: 16 }}>
            {acceptButton ?? acceptButton}
            {cancelButton ?? cancelButton}
          </View>
        </View>
      </View>
    </Modal>
  );
}
