import { View, Text } from "react-native";
import { Circle, G, Svg } from "react-native-svg";
import { formatTime, getTimeFromSeconds } from "../utils/utils";
import Button from "./Button";

const RADIUS = 130;
const STROKE_WIDTH = 16;
const HALF_CIRCLE = RADIUS + STROKE_WIDTH;

const STROKE_WIDTH_INNER = 8;
const RADIUS_SEC = RADIUS - STROKE_WIDTH_INNER / 2;
const RADIUS_MIN = RADIUS + STROKE_WIDTH_INNER / 2;

const CIRCUMFERENCE_SEC = 2 * Math.PI * RADIUS_SEC;
const CIRCUMFERENCE_MIN = 2 * Math.PI * RADIUS_MIN;

interface Props {
  timeInSeconds: number;
  onStart: () => void;
  started: boolean;
}

export default function Clock({ timeInSeconds, onStart, started }: Props) {
  const time = getTimeFromSeconds(timeInSeconds);

  return (
    <View
      className="flex-1 justify-center items-center relative"
      style={{ width: RADIUS * 2, height: RADIUS * 2 }}
    >
      {!started ? (
        <Button
          text={"Start"}
          onPress={onStart}
          width={RADIUS * 2}
          height={RADIUS * 2}
          rounded
        />
      ) : (
        <>
          <Svg
            className="absolute"
            width={RADIUS * 2}
            height={RADIUS * 2}
            viewBox={`0 0 ${HALF_CIRCLE * 2} ${HALF_CIRCLE * 2}`}
          >
            <G rotation="-90" origin={`${HALF_CIRCLE}, ${HALF_CIRCLE}`}>
              <Circle
                cx="50%"
                cy="50%"
                stroke="white"
                strokeWidth={STROKE_WIDTH}
                r={RADIUS}
              />
              <Circle
                cx="50%"
                cy="50%"
                stroke="violet"
                strokeWidth={STROKE_WIDTH_INNER}
                r={RADIUS_SEC}
                strokeDasharray={CIRCUMFERENCE_SEC}
                strokeDashoffset={
                  CIRCUMFERENCE_SEC -
                  Math.floor(CIRCUMFERENCE_SEC / 60) * time.seconds
                }
              />
              <Circle
                cx="50%"
                cy="50%"
                stroke="orange"
                strokeWidth={STROKE_WIDTH_INNER}
                r={RADIUS_MIN}
                strokeDasharray={CIRCUMFERENCE_MIN}
                strokeDashoffset={
                  CIRCUMFERENCE_MIN -
                  Math.floor(CIRCUMFERENCE_MIN / 60) * time.minutes
                }
              />
            </G>
          </Svg>
          <Text className="text-white text-4xl">{formatTime(time)}</Text>
        </>
      )}
    </View>
  );
}
