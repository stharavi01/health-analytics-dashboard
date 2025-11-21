import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));
    expect(result.current).toBe("test");
  });

  it("debounces value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 100 } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 100 });

    await waitFor(
      () => {
        expect(result.current).toBe("updated");
      },
      { timeout: 200 }
    );
  });
});
