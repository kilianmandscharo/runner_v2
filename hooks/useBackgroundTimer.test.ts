import { renderHook, act } from "@testing-library/react-native";

jest.mock("react-native/Libraries/AppState/AppState", () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentState: "active",
}));

jest.useFakeTimers();

const incrementMock = jest.fn();
const onSecondsChangeMock = jest.fn();

import useBackgroundTimer from "../hooks/useBackgroundTimer";

describe("useBackgroundTimer", () => {
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });
  //
  // it("should AppState event listener", () => {
  //   renderHook(() => useBackgroundTimer(0, onSecondsChangeMock, incrementMock));
  //
  //   expect(mockAppState).toHaveBeenCalled();
  // });

  // it("should start the timer and increment seconds", () => {
  //   const { result } = renderHook(() =>
  //     useBackgroundTimer(0, onSecondsChangeMock, incrementMock),
  //   );
  //   const { startTimer } = result.current;
  //
  //   act(() => {
  //     startTimer();
  //     jest.advanceTimersByTime(3000);
  //   });
  //
  //   expect(incrementMock).toHaveBeenCalledTimes(3);
  // });

  // test("should stop the timer and keep track of seconds", () => {
  //   const { result } = renderHook(() => useBackgroundTimer());
  //   const { startTimer, stopTimer } = result.current;
  //
  //   act(() => {
  //     startTimer();
  //     jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
  //     stopTimer();
  //     jest.advanceTimersByTime(2000); // Advance timers by additional 2 seconds
  //   });
  //
  //   expect(result.current.seconds).toBe(3);
  // });
  //
  // test("should reset the timer and seconds", () => {
  //   const { result } = renderHook(() => useBackgroundTimer());
  //   const { startTimer, stopTimer, resetTimer } = result.current;
  //
  //   act(() => {
  //     startTimer();
  //     jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
  //     stopTimer();
  //     resetTimer();
  //     jest.advanceTimersByTime(2000); // Advance timers by additional 2 seconds
  //   });
  //
  //   expect(result.current.seconds).toBe(0);
  // });
});
