import { useEffect, useState } from "react";

import { notifyListeners, setCachedValue, swr } from "./cache";

export interface SWRState<T> {
  loading: boolean;
  value?: T;
}

export type SWRUpdater<T> = (updater: (clonedValue: T) => void) => void;

export function useSWR<T>(
  cacheKey: string,
  loader: () => Promise<T | undefined>,
  saver?: (value: T) => void
): SWRState<T> & { updateValue: SWRUpdater<T>; revalidate: () => void } {
  const [state, setState] = useState<SWRState<T>>({ loading: true });
  const [shouldRevalidate, setShouldRevalidate] = useState(false);

  useEffect(() => {
    if (setShouldRevalidate) {
      setShouldRevalidate(false);
    }

    return swr(cacheKey, loader, (state) => {
      setState(state);
    });
  }, [cacheKey, shouldRevalidate]);

  return {
    ...state,
    revalidate: () => setShouldRevalidate(true),
    updateValue: (updater) => {
      const clonedValue = structuredClone(state.value);
      if (!clonedValue) return;

      updater(clonedValue);
      setState({ loading: false, value: clonedValue });
      setCachedValue(cacheKey, clonedValue);
      notifyListeners(cacheKey, clonedValue);
      saver?.(clonedValue);
    },
  };
}
