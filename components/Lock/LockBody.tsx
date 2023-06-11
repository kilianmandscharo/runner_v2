import { View, StyleSheet, Animated } from "react-native";
import {
  LOCK_CIRCLE_RADIUS,
  LOCK_HEIGHT,
  LOCK_WIDTH,
} from "../../constants/constants";

interface Props {
  animatedOpacityValue: Animated.Value;
}

export default function LockBody({ animatedOpacityValue }: Props) {
  return (
    <View style={styles.lock}>
      <Animated.View
        style={[styles.lockShackle, { opacity: animatedOpacityValue }]}
      />
      <View style={styles.lockBody} />
      <View style={styles.keyWay} />
    </View>
  );
}

const styles = StyleSheet.create({
  lock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    position: "absolute",
    top: LOCK_CIRCLE_RADIUS / 2 + LOCK_HEIGHT / 2,
    left: LOCK_CIRCLE_RADIUS / 2 + LOCK_WIDTH / 2,
  },
  lockShackle: {
    width: 10,
    height: 10,
    backgroundColor: "transparent",
    borderTopStartRadius: 4,
    borderTopEndRadius: 4,
    borderColor: "black",
    borderWidth: 4,
    position: "absolute",
    bottom: 4,
  },
  lockBody: {
    backgroundColor: "black",
    width: 30,
    height: 30,
    borderRadius: 4,
    marginTop: 5,
  },
  keyWay: {
    width: 4,
    height: 4,
    backgroundColor: "white",
    borderRadius: 50,
    position: "absolute",
    top: 10,
  },
});
