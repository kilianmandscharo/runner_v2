import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Navbar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ ...styles.container, marginTop: insets.top }}>
      <Link href="/">Home</Link>
      <Link href="new">New Run</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
