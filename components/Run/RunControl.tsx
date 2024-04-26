import { View } from "react-native";
import Button from "../Button";
import Lock from "../Lock/Lock";
import { RunState } from "../../types/types";
import { useState } from "react";

interface Props {
  state: RunState;
  start: () => void;
  stop: () => void;
  end: () => void;
  reset: () => void;
}

export default function RunControl({ state, start, stop, end, reset }: Props) {
  const [locked, setLocked] = useState<boolean>(true);

  const lockDisabled =
    state === RunState.Prestart || state === RunState.Finished;

  return (
    <View className="flex-1 justify-center items-center" style={{ gap: 16 }}>
      <Lock
        disabled={lockDisabled}
        toggle={state === RunState.Finished}
        onLock={() => setLocked(true)}
        onUnlock={() => setLocked(false)}
      />
      <StartStopButton
        state={state}
        locked={locked}
        onStart={start}
        onStop={stop}
      />
      <EndResetButton
        state={state}
        locked={locked}
        onEnd={end}
        onReset={() => {
          setLocked(true);
          reset();
        }}
      />
    </View>
  );
}

interface StartStopButtonProps {
  state: RunState;
  locked: boolean;
  onStart: () => void;
  onStop: () => void;
}

function StartStopButton({
  state,
  locked,
  onStart,
  onStop,
}: StartStopButtonProps) {
  if (state === RunState.Stopped) {
    return <Button onPress={onStart} text="Weiter" disabled={locked} />;
  }
  return (
    <Button
      onPress={onStop}
      text="Stopp"
      disabled={state !== RunState.Started || locked}
    />
  );
}

interface EndResetButtonProps {
  state: RunState;
  locked: boolean;
  onEnd: () => void;
  onReset: () => void;
}

function EndResetButton({
  state,
  locked,
  onEnd,
  onReset,
}: EndResetButtonProps) {
  if (state === RunState.Finished) {
    return <Button onPress={onReset} text="Zurücksetzen" />;
  }
  return (
    <Button
      onPress={onEnd}
      text="Beenden"
      disabled={state === RunState.Prestart || locked}
    />
  );
}
