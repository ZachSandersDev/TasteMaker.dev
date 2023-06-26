export const CACHE_TTL = 500;

export interface SWRCacheEntry<T> {
  timestamp: number;
  loading?: boolean;
  value: T | undefined;
}

export interface SWRState<T> {
  loading: boolean;
  value: T | undefined;
}

export type SWRListener<T> = (update: SWRState<T>) => void;

const listeners = new Map<string, SWRListener<any>[]>();

function addListener(cacheKey: string, callback: (value: any) => void) {
  const listenersForKey = listeners.get(cacheKey) || [];
  listeners.set(cacheKey, [...listenersForKey, callback]);
}

function removeListener(cacheKey: string, callback: (value: any) => void) {
  const listenersForKey = listeners.get(cacheKey) || [];
  listeners.set(
    cacheKey,
    listenersForKey.filter((l) => l != callback)
  );
}

export function notifyListeners(cacheKey: string, value: any) {
  const listenersForKey = listeners.get(cacheKey) || [];
  listenersForKey.forEach((listener) => listener({ loading: false, value }));
}

function setIsLoading(cacheKey: string) {
  const timestamp = new Date().getTime();
  const { value } = getCacheEntry(cacheKey) || {};

  const cachedValue = JSON.stringify({ timestamp, value, loading: true });
  localStorage.setItem(cacheKey, cachedValue);
}

function isLoading(cacheKey: string): boolean {
  return !!getCacheEntry(cacheKey)?.loading;
}

function getCacheEntry<T>(cacheKey: string): SWRCacheEntry<T> | undefined {
  const cacheEntry =
    JSON.parse(localStorage.getItem(cacheKey) || "0") || undefined;
  if (!cacheEntry) return;

  return cacheEntry;
}

export function setCachedValue<T>(cacheKey: string, value: T) {
  const timestamp = new Date().getTime();
  const cachedValue = JSON.stringify({ timestamp, value });
  localStorage.setItem(cacheKey, cachedValue);
}

export function swr<T>(
  cacheKey: string,
  loader: () => Promise<T | undefined>,
  callback: SWRListener<T>
): () => void {
  const cacheEntry = getCacheEntry<T>(cacheKey);
  const isCurrentlyLoading = isLoading(cacheKey);

  // If we have a cached value, immediately return that while we load from network
  if (cacheEntry && !isCurrentlyLoading) {
    callback({ loading: false, value: cacheEntry.value });
  }
  // Otherwise, return that we're loading from network
  else {
    callback({ loading: true, value: undefined });
  }

  // If we're already loading, skip calling loader() again
  if (isCurrentlyLoading) {
    addListener(cacheKey, callback);
  }
  // Otherwise, load from network and notify listeners
  else {
    setIsLoading(cacheKey);
    loader()
      .then((value) => {
        setCachedValue(cacheKey, value);
        notifyListeners(cacheKey, value);
        callback({ loading: false, value });
      })
      .catch(() => {
        setCachedValue(cacheKey, undefined);
        notifyListeners(cacheKey, undefined);
        callback({ loading: false, value: undefined });
      });
  }

  return () => removeListener(cacheKey, callback);
}

export function swrOnce<T>(
  cacheKey: string,
  loader: () => Promise<T | undefined>
): Promise<T | undefined> {
  return new Promise((resolve) => {
    const listener = ({ loading, value }: SWRState<T>) => {
      if (!loading) {
        resolve(value);
        removeListener(cacheKey, listener);
      }
    };

    swr(cacheKey, loader, listener);
  });
}
