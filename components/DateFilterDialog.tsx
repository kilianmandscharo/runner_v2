import dayjs from "dayjs";
import { View, Text, Modal } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Button from "./Button";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";

interface Props {
  open: boolean;
  onClose: () => void;
  start: Date;
  end: Date;
  onStartChange: (date: Date | undefined) => void;
  onEndChange: (date: Date | undefined) => void;
}

export default function DateFilterDialog({
  open,
  onClose,
  start,
  end,
  onStartChange,
  onEndChange,
}: Props) {
  const [showStart, setShowStart] = useState<boolean>(false);
  const [showEnd, setShowEnd] = useState<boolean>(false);

  const handleStartChange = (
    e: DateTimePickerEvent,
    date: Date | undefined
  ) => {
    if (e.type === "set") {
      onStartChange(date);
    }
    setShowStart(false);
  };

  const handleEndChange = (e: DateTimePickerEvent, date: Date | undefined) => {
    if (e.type === "set") {
      onEndChange(date);
    }
    setShowEnd(false);
  };

  return (
    <Modal visible={open} animationType="fade" transparent>
      <View className="flex-1 justify-center items-center bg-slate-700/60">
        <View
          style={{ gap: 32 }}
          className="h-fit w-11/12 justify-between items-center p-8 rounded-s bg-slate-700"
        >
          <View className="w-full flex flex-row items-center justify-between">
            <Text className="text-2xl text-white">
              Start: {dayjs(start).format("DD.MM.YYYY")}
            </Text>
            <Button
              onPress={() => setShowStart(true)}
              width={40}
              height={40}
              icon={<Entypo name="edit" size={24} color="white" />}
            />
          </View>
          {showStart && (
            <DateTimePicker
              value={start}
              onChange={handleStartChange}
              display="inline"
            />
          )}
          <View className="w-full flex flex-row items-center justify-between">
            <Text className="text-2xl text-white">
              Ende: {dayjs(end).format("DD.MM.YYYY")}
            </Text>
            <Button
              onPress={() => setShowEnd(true)}
              width={40}
              height={40}
              icon={<Entypo name="edit" size={24} color="white" />}
            />
          </View>
          {showEnd && <DateTimePicker value={end} onChange={handleEndChange} />}
          <Button onPress={onClose} text="Fertig" />
        </View>
      </View>
    </Modal>
  );
}
