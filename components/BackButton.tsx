import { useRouter } from "expo-router";
import Button from "./Button";
import { MaterialIcons } from "@expo/vector-icons";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      width={40}
      height={40}
      variant="ghost"
      icon={<MaterialIcons name="arrow-back" size={32} color="white" />}
      onPress={() => router.back()}
    />
  );
}
