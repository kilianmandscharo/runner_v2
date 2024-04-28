import { Animated } from "react-native";
import { Circle, G, Svg } from "react-native-svg";
import {
  LOCK_CIRCLE_RADIUS,
  LOCK_CIRCLE_STROKE_WIDTH,
  LOCK_CIRCLE_CIRCUMFERENCE,
  LOCK_HALF_CIRCLE,
} from "./constants";
import { colors } from "../../assets/colors";

interface Props {
  animatedFillValue: Animated.Value;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function LockCircle({ animatedFillValue }: Props) {
  return (
    <Svg
      className="absolute"
      width={LOCK_CIRCLE_RADIUS * 2}
      height={LOCK_CIRCLE_RADIUS * 2}
      viewBox={`0 0 ${LOCK_HALF_CIRCLE * 2} ${LOCK_HALF_CIRCLE * 2}`}
    >
      <G rotation="-90" origin={`${LOCK_HALF_CIRCLE}, ${LOCK_HALF_CIRCLE}`}>
        <Circle
          cx="50%"
          cy="50%"
          stroke={colors.sky["500"]}
          strokeWidth={LOCK_CIRCLE_STROKE_WIDTH}
          r={LOCK_CIRCLE_RADIUS}
          strokeOpacity={0.5}
          fill="transparent"
        />
        <AnimatedCircle
          cx="50%"
          cy="50%"
          stroke="orange"
          strokeWidth={LOCK_CIRCLE_STROKE_WIDTH}
          r={LOCK_CIRCLE_RADIUS}
          fill="transparent"
          strokeDasharray={LOCK_CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={animatedFillValue}
        />
      </G>
    </Svg>
  );
}
