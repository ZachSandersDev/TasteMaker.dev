export const CACHE_TTL = 500;

export interface SWRCacheEntry<T> {
  timestamp: number;
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

  const cachedValue = JSON.stringify({ timestamp, value });
  localStorage.setItem(cacheKey, cachedValue);
}

function isLoading(cacheKey: string): boolean {
  const cachedValue =
    JSON.parse(localStorage.getItem(cacheKey) || "0") || undefined;
  if (!cachedValue) return false;

  const { timestamp } = cachedValue;
  const now = new Date().getTime();
  const isExpired = now - timestamp > CACHE_TTL;

  return !isExpired;
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
  if (cacheEntry) {
    callback({ loading: false, value: cacheEntry.value });
  }

  // If the only option we have is to load from network, notify we're loading
  else {
    callback({ loading: true, value: undefined });
  }

  // If we're already loading, skip calling loader() again
  if (isLoading(cacheKey)) {
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
