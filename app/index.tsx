import { useRouter } from "expo-router";
import { View, StyleSheet, Dimensions } from "react-native";
import Button from "../components/Button";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button onPress={() => router.push("/new")} text="Neu" />
      <Button onPress={() => router.push("/history")} text="Läufe" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    gap: 16,
  },
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  // },
  // header: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   flexDirection: "row",
  //   paddingRight: width / 35,
  // },
});

// const [fontsLoaded] = useFonts({
//   "FugazOne-Regular": require("../assets/fonts/FugazOne-Regular.ttf"),
// });
//
// return (
//   <View style={styles.container}>
//     <View style={styles.header}>
//       <Logo />
//       <Svg width={width / 1.35} height={height / 11}>
//         <SvgText
//           fontFamily="FugazOne-Regular"
//           fill="blue"
//           stroke="white"
//           strokeWidth="2"
//           fontSize={width / 5.5}
//           textAnchor="start"
//           y={height / 12}
//         >
//           RUNNER
//         </SvgText>
//       </Svg>
//     </View>
//     <Link href="new">New Run</Link>
//   </View>
// );
