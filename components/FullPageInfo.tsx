import { Text, View } from "react-native";
import PageContainer from "./PageContainer";

interface Props {
  text: string;
}

export default function FullPageInfo({ text }: Props) {
  return (
    <PageContainer>
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">{text}</Text>
      </View>
    </PageContainer>
  );
}
