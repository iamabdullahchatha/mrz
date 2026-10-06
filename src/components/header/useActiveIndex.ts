"use client";

import { useCallback, useState } from "react";

export type Direction = 1 | -1;

/** Active item index plus the direction of the last change (1 = moved down the list). */
export function useActiveIndex(initial = 0) {
  const [state, setState] = useState<{ index: number; direction: Direction }>({ index: initial, direction: 1 });
  const setIndex = useCallback(
    (i: number) =>
      setState((s) => (s.index === i ? s : { index: i, direction: i > s.index ? 1 : -1 })),
    [],
  );
  return [state.index, state.direction, setIndex] as const;
}
