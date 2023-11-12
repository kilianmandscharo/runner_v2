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

  // test("should resume the timer when app comes to foreground", () => {
  //   const { result } = renderHook(() => useBackgroundTimer());
  //   const { startTimer } = result.current;
  //
  //   const appStateMock = jest.spyOn(AppState, "addEventListener");
  //
  //   act(() => {
  //     startTimer();
  //     jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
  //     appStateMock.mock.calls[0][1], { app_state: "background" };
  //     jest.advanceTimersByTime(2000); // Advance timers by additional 2 seconds
  //     appStateMock.mock.calls[0][1], { app_state: "active" };
  //   });
  //
  //   expect(result.current.seconds).toBe(5);
  // });
  //
  // test("should show the correct time when the timer is stopped and app comes to foreground", () => {
  //   const { result } = renderHook(() => useBackgroundTimer());
  //   const { startTimer, stopTimer } = result.current;
  //
  //   const appStateMock = jest.spyOn(AppState, "addEventListener");
  //
  //   act(() => {
  //     startTimer();
  //     jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
  //     stopTimer();
  //     appStateMock.mock.calls[0][1], { app_state: "background" };
  //     jest.advanceTimersByTime(2000); // Advance timers by additional 2 seconds
  //     appStateMock.mock.calls[0][1], { app_state: "active" };
  //   });
  //
  //   expect(result.current.seconds).toBe(3);
  // });
});
