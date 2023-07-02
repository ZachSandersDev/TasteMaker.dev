export const CACHE_TTL = 500;
export const DEDUPE_TTL = 500;

export interface SWRCacheEntry<T> {
  lastFetched?: number;
  loadingStart?: number;
  value?: T;
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
  const { value } = getCacheEntry(cacheKey) || {};

  const cacheEntry: SWRCacheEntry<unknown> = {
    loadingStart: Date.now(),
    value,
  };

  localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
}

function shouldFetch(cacheKey: string): boolean {
  if (
    // If we fetched recently or are currently loading, don't fetch
    isRecent(cacheKey) ||
    isLoading(cacheKey)
  ) {
    return false;
  }

  return true;
}

function isRecent(cacheKey: string): boolean {
  const { lastFetched } = getCacheEntry(cacheKey) || {};
  if (!lastFetched || lastFetched < Date.now() - CACHE_TTL) {
    return false;
  }

  return true;
}

function isLoading(cacheKey: string): boolean {
  const { loadingStart } = getCacheEntry(cacheKey) || {};
  if (!loadingStart || loadingStart < Date.now() - DEDUPE_TTL) {
    return false;
  }

  return true;
}

function getCacheEntry<T>(cacheKey: string): SWRCacheEntry<T> | undefined {
  const cacheEntry =
    JSON.parse(localStorage.getItem(cacheKey) || "0") || undefined;
  if (!cacheEntry) return;

  return cacheEntry;
}

export function setCachedValue<T>(cacheKey: string, value: T) {
  const cacheEntry: SWRCacheEntry<T> = { lastFetched: Date.now(), value };
  localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
}

export function swr<T>(
  cacheKey: string,
  loader: () => Promise<T | undefined>,
  callback: SWRListener<T>
): () => void {
  // If we have a cached value, return it
  const cacheEntry = getCacheEntry<T>(cacheKey);
  if (cacheEntry?.value) {
    callback({
      loading: false,
      value: cacheEntry.value,
    });
  }
  // Otherwise return loading
  else {
    callback({ loading: true, value: undefined });
  }

  // If we're already loading, don't load again
  if (isLoading(cacheKey)) {
    addListener(cacheKey, callback);
  }
  // If we haven't revalidated in a bit, and we aren't already loading, load from network and notify listeners
  else if (shouldFetch(cacheKey)) {
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
