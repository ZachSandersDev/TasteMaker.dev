import { useEffect, useState } from "react";

import { swr } from "./cache";

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

  const revalidate = () => {
    swr(cacheKey, loader, (value) => {
      setState({ loading: false, value });
    });
  };

  useEffect(() => {
    setState({ loading: true });
    revalidate();
  }, [cacheKey]);

  return {
    ...state,
    revalidate,
    updateValue: (updater) => {
      const clonedValue = structuredClone(state.value);
      if (!clonedValue) return;

      updater(clonedValue);
      setState({ loading: false, value: clonedValue });
      saver?.(clonedValue);
    },
  };
}
