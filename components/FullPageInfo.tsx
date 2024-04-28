import { Text, View } from "react-native";
import PageContainer from "./PageContainer";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  text: string;
}

export default function FullPageInfo({ text }: Props) {
  return (
    <PageContainer>
      <View className="flex-1 justify-center items-center flex-row gap-4">
        <MaterialIcons name="info-outline" size={32} color="white" />
        <Text className="text-white text-lg">{text}</Text>
      </View>
    </PageContainer>
  );
}
