import dayjs from "dayjs";
import { View, Text } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Button from "../Button";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import Divider from "../Divider";

interface Props {
  start: Date;
  end: Date;
  onStartChange: (date: Date | undefined) => void;
  onEndChange: (date: Date | undefined) => void;
}

export default function DateFilter({
  start,
  end,
  onStartChange,
  onEndChange,
}: Props) {
  const [showStart, setShowStart] = useState<boolean>(false);
  const [showEnd, setShowEnd] = useState<boolean>(false);

  const handleStartChange = (
    e: DateTimePickerEvent,
    date: Date | undefined,
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

  const handleShowStart = () => {
    setShowStart(true);
  };

  const handleShowEnd = () => {
    setShowEnd(true);
  };

  return (
    <View
      className="justify-between items-center bg-slate-700 mb-6 py-3 rounded border-2 border-sky-100"
      style={{ gap: 12 }}
    >
      <FilterItem label="Von" value={start} onPress={handleShowStart} />
      {showStart && (
        <DateTimePicker value={start} onChange={handleStartChange} />
      )}
      <FilterItem label="Bis" value={end} onPress={handleShowEnd} />
      {showEnd && <DateTimePicker value={end} onChange={handleEndChange} />}
    </View>
  );
}

interface FilterItemProps {
  label: string;
  value: Date;
  onPress: () => void;
}

function FilterItem({ label, value, onPress }: FilterItemProps) {
  return (
    <View className="w-full flex flex-row items-center justify-between px-4">
      <View>
        <Text className="text-sm text-white">{label}:</Text>
        <Text className="text-lg text-sky-200">
          {dayjs(value).format("DD.MM.YYYY")}
        </Text>
      </View>
      <Button
        onPress={onPress}
        width={32}
        height={32}
        icon={<Entypo name="edit" size={16} color="white" />}
      />
    </View>
  );
}
