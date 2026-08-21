import { useEffect, useState } from "react";

/**
 * Returns `value` delayed by `delayMs`, so a value that keeps changing (a
 * search box being typed into) only settles once the user pauses.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
