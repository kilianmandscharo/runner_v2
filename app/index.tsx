import { useRouter } from "expo-router";
import { View, Dimensions } from "react-native";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export default function Home() {
  const router = useRouter();

  return (
    <PageContainer>
      <View className="flex-1 justify-center items-center" style={{ gap: 16 }}>
        <Button onPress={() => router.push("/new")} text="Neu" />
        <Button onPress={() => router.push("/history")} text="Läufe" />
      </View>
    </PageContainer>
  );
}
