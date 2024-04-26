import useBackgroundTimer from "../hooks/useBackgroundTimer";
import { renderHook, act } from "@testing-library/react-native";
// import { AppState } from "react-native";

jest.useFakeTimers(); // Mock timers for testing

describe("useBackgroundTimer", () => {
  test("should start the timer and increment seconds", () => {
    const { result } = renderHook(() => useBackgroundTimer());
    const { startTimer } = result.current;

    act(() => {
      startTimer();
      jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
    });

    expect(result.current.seconds).toBe(3);
  });

  test("should stop the timer and keep track of seconds", () => {
    const { result } = renderHook(() => useBackgroundTimer());
    const { startTimer, stopTimer } = result.current;

    act(() => {
      startTimer();
      jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
      stopTimer();
      jest.advanceTimersByTime(2000); // Advance timers by additional 2 seconds
    });

    expect(result.current.seconds).toBe(3);
  });

  test("should reset the timer and seconds", () => {
    const { result } = renderHook(() => useBackgroundTimer());
    const { startTimer, stopTimer, resetTimer } = result.current;

    act(() => {
      startTimer();
      jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
      stopTimer();
      resetTimer();
      jest.advanceTimersByTime(2000); // Advance timers by additional 2 seconds
    });

    expect(result.current.seconds).toBe(0);
  });
});
