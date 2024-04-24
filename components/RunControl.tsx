import { View } from "react-native";
import Button from "./Button";
import Lock from "./Lock/Lock";
import { RunState } from "../types/types";
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

  const lockDisabled = state !== RunState.Started;

  return (
    <View className="flex-1 justify-center items-center" style={{ gap: 16 }}>
      <Lock
        disabled={lockDisabled}
        toggle={state === RunState.Finished}
        onLock={() => setLocked(true)}
        onUnlock={() => setLocked(false)}
      />
      {state === RunState.Stopped ? (
        <Button onPress={start} text="Weiter" disabled={locked} />
      ) : (
        <Button
          onPress={stop}
          text="Stopp"
          disabled={state === RunState.Finished || locked}
        />
      )}
      {state !== RunState.Finished ? (
        <Button
          onPress={end}
          text="Beenden"
          disabled={state === RunState.Prestart || locked}
        />
      ) : (
        <Button
          onPress={() => {
            reset();
            setLocked(true);
          }}
          text="Zurücksetzen"
        />
      )}
    </View>
  );
}
