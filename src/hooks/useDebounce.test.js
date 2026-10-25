import { act, renderHook } from "@testing-library/react";
import useDebounce from "./useDebounce";

describe("useDebounce", () => {
  it("menunda perubahan nilai", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), { initialProps: { v: "a" } });
    rerender({ v: "b" });
    expect(result.current).toBe("a");
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("b");
    vi.useRealTimers();
  });
  it("memakai delay bawaan", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ v }) => useDebounce(v), { initialProps: { v: 1 } });
    rerender({ v: 2 });
    act(() => vi.advanceTimersByTime(250));
    expect(result.current).toBe(2);
    vi.useRealTimers();
  });
});
