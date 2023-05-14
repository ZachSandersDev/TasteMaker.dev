import { useEffect, useState } from "react";

export interface LoaderState<T> {
  loading: boolean;
  data?: T;
}

export default function useLoader<T>(loader: () => Promise<T>, loadingByDefault?: boolean) {
  const [state, setState] = useState<LoaderState<T>>({ loading: loadingByDefault || false });

  useEffect(() => {
    (async () => {
      setState({ loading: true });
      const data = await loader();
      setState({ loading: false, data });
    })();
  }, [loader, setState,]);

  return { ...state };
}