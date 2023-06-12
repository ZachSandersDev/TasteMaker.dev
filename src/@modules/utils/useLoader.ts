import { Unsubscribe } from "firebase/database";
import { useEffect, useState } from "react";

import { getCachedValue } from "./cache";

export interface LoaderState<T> {
  loading: boolean;
  data?: T;
}

export type LoaderFunc<T> = (callback: (newValue: T | undefined) => void) => Unsubscribe

export default function useLoader<T>(loader: LoaderFunc<T>, cacheKey: string) {
  const cachedValue = getCachedValue<T>(cacheKey);
  const [state, setState] = useState<LoaderState<T>>({ loading: !cachedValue, data: getCachedValue<T>(cacheKey) });
  
  useEffect(() => {
    const cachedValue = getCachedValue<T>(cacheKey);
    setState({ loading: !cachedValue, data: cachedValue });

    const unsub = loader((newData) => {
      setState({ loading: false, data: newData });

      if (!newData) {
        sessionStorage.removeItem(cacheKey);
      } else {
        sessionStorage.setItem(cacheKey, JSON.stringify(newData));
      }
    });
    return unsub;
  }, [loader, setState]);

  return {
    loading: state.loading,
    data: state.data,
    setData: (newData: T) => setState({ loading: false, data: newData })
  };
}
