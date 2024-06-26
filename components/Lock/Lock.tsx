import { useState, useRef, useEffect } from "react";
import { Animated, Pressable } from "react-native";
import LockCircle from "./LockCircle";
import { FontAwesome } from "@expo/vector-icons";
import { LOCK_CIRCLE_CIRCUMFERENCE } from "./constants";

interface Props {
  onUnlock: () => void;
  onLock: () => void;
  disabled: boolean;
  toggle: boolean;
}

export default function Lock({ onUnlock, onLock, disabled, toggle }: Props) {
  const [finished, setFinished] = useState<boolean>(false);
  const [unlocked, setUnlocked] = useState<boolean>(false);

  const animatedFillValue = useRef(
    new Animated.Value(LOCK_CIRCLE_CIRCUMFERENCE),
  ).current;
  const animatedOpacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (toggle) {
      fadeIn().start(() => {
        setFinished(false);
        setUnlocked(false);
        animation(animatedFillValue, LOCK_CIRCLE_CIRCUMFERENCE, 500).start();
      });
    }
  }, [toggle]);

  const onPressIn = () => {
    if (disabled) return;

    fill().start(({ finished }) => {
      if (finished) {
        setFinished(true);
        onUnlock();
        fadeOut().start();
      }
    });
  };

  const onPressOut = () => {
    if (disabled) return;

    if (finished && !unlocked) {
      setUnlocked(true);
    } else {
      fill().stop();
      animatedFillValue.setValue(LOCK_CIRCLE_CIRCUMFERENCE);
    }
  };

  const onPress = () => {
    if (disabled) return;

    if (unlocked) {
      setFinished(false);
      setUnlocked(false);
      onLock();
      animatedFillValue.setValue(LOCK_CIRCLE_CIRCUMFERENCE);
      fadeIn().start();
    }
  };

  const animation = (
    animationValue: Animated.Value,
    toValue: number,
    duration: number,
  ): Animated.CompositeAnimation => {
    return Animated.timing(animationValue, {
      toValue,
      duration,
      useNativeDriver: true,
    });
  };

  const fill = () => animation(animatedFillValue, 0, 1500);
  const fadeIn = () => animation(animatedOpacityValue, 1, 400);
  const fadeOut = () => animation(animatedOpacityValue, 0, 400);

  return (
    <Pressable
      className="justify-center items-center w-[100] h-[100]"
      style={{ opacity: disabled ? 0.5 : 1 }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <LockCircle animatedFillValue={animatedFillValue} />
      {unlocked ? (
        <FontAwesome name="unlock-alt" size={48} color="white" />
      ) : (
        <FontAwesome name="lock" size={48} color="white" />
      )}
    </Pressable>
  );
}
