import { View, Text } from "react-native";
import { Circle, G, Svg } from "react-native-svg";
import { formatTime, getTimeFromSeconds } from "../../utils/utils";
import Button from "../Button";

const RADIUS = 130;
const DIAMETER = RADIUS * 2;
const STROKE_WIDTH = 16;
const HALF_CIRCLE = RADIUS + STROKE_WIDTH;

const STROKE_WIDTH_INNER = 8;
const RADIUS_SEC = RADIUS - STROKE_WIDTH_INNER / 2;
const RADIUS_MIN = RADIUS + STROKE_WIDTH_INNER / 2;

const CIRCUMFERENCE_SEC = 2 * Math.PI * RADIUS_SEC;
const CIRCUMFERENCE_MIN = 2 * Math.PI * RADIUS_MIN;

const SEGMENT_SEC = CIRCUMFERENCE_SEC / 60;
const SEGMENT_MIN = CIRCUMFERENCE_MIN / 60;

interface Props {
  timeInSeconds: number;
  onStart: () => void;
  started: boolean;
  disabled: boolean;
}

export default function Clock({
  timeInSeconds,
  onStart,
  started,
  disabled,
}: Props) {
  const time = getTimeFromSeconds(timeInSeconds);

  const seconds = time.seconds || 60;
  const minutes = time.minutes;

  const offsetSec = CIRCUMFERENCE_SEC - SEGMENT_SEC * seconds;
  const offsetMin = CIRCUMFERENCE_MIN - SEGMENT_MIN * minutes;

  return (
    <View
      className="flex-1 justify-center items-center relative"
      style={{ width: DIAMETER, height: DIAMETER }}
    >
      {!started ? (
        <Button
          text={"Start"}
          onPress={onStart}
          width={DIAMETER}
          height={DIAMETER}
          round
          disabled={disabled}
        />
      ) : (
        <>
          <Svg
            className="absolute"
            width={DIAMETER}
            height={DIAMETER}
            viewBox={`0 0 ${HALF_CIRCLE * 2} ${HALF_CIRCLE * 2}`}
          >
            <G rotation="-90" origin={`${HALF_CIRCLE}, ${HALF_CIRCLE}`}>
              <Circle
                cx="50%"
                cy="50%"
                stroke="#e2e8f0"
                strokeWidth={STROKE_WIDTH}
                r={RADIUS}
                fill="black"
              />
              <Circle
                cx="50%"
                cy="50%"
                stroke="orange"
                strokeWidth={STROKE_WIDTH_INNER}
                r={RADIUS_MIN}
                strokeDasharray={CIRCUMFERENCE_MIN}
                strokeDashoffset={offsetMin}
                fill="none"
              />
              <Circle
                cx="50%"
                cy="50%"
                stroke="violet"
                strokeWidth={STROKE_WIDTH_INNER}
                r={RADIUS_SEC}
                strokeDasharray={CIRCUMFERENCE_SEC}
                strokeDashoffset={offsetSec}
                fill="none"
              />
            </G>
          </Svg>
          <Text className="text-white text-4xl">{formatTime(time)}</Text>
        </>
      )}
    </View>
  );
}
