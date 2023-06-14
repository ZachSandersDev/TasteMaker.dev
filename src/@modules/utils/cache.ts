export const CACHE_TTL = 500;

const listeners = new Map<string, ((value: any) => void)[]>();

function addListener(cacheKey: string, callback: (value: any) => void) {
  const listenersForKey = listeners.get(cacheKey) || [];
  listeners.set(cacheKey, [...listenersForKey, callback]);
}

function notifyListeners(cacheKey: string, value: any) {
  const listenersForKey = listeners.get(cacheKey) || [];
  listeners.set(cacheKey, []);

  listenersForKey.forEach((listener) => listener(value));
  listeners.delete(cacheKey);
}

function setIsLoading(cacheKey: string) {
  const timestamp = new Date().getTime();
  const value = getCachedValue(cacheKey);

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

function getCachedValue<T>(cacheKey: string): T | undefined {
  const cachedValue =
    JSON.parse(localStorage.getItem(cacheKey) || "0") || undefined;
  if (!cachedValue) return;

  const { value } = cachedValue;
  return value;
}

export function setCachedValue<T>(cacheKey: string, value: T) {
  const timestamp = new Date().getTime();
  const cachedValue = JSON.stringify({ timestamp, value });
  localStorage.setItem(cacheKey, cachedValue);
}

export function swr<T>(
  cacheKey: string,
  loader: () => Promise<T | undefined>,
  callback: (value: T | undefined) => void
): void {
  if (isLoading(cacheKey)) {
    addListener(cacheKey, callback);
    return;
  }

  const cachedValue = getCachedValue<T>(cacheKey);
  if (cachedValue) {
    callback(cachedValue);
  }

  setIsLoading(cacheKey);
  loader()
    .then((value) => {
      // console.log("swr", cacheKey, value);

      setCachedValue(cacheKey, value);
      notifyListeners(cacheKey, value);
      callback(value);
    })
    .catch((error) => {
      // console.log("swr", cacheKey, error);
    });
}

export function swrOnce<T>(
  cacheKey: string,
  loader: () => Promise<T | undefined>
): Promise<T | undefined> {
  return new Promise((resolve) => {
    if (isLoading(cacheKey)) {
      addListener(cacheKey, resolve);
      return;
    }

    const cachedValue = getCachedValue<T>(cacheKey);
    if (cachedValue) {
      resolve(cachedValue);
      return;
    }

    setIsLoading(cacheKey);
    loader().then((value) => {
      setCachedValue(cacheKey, value);
      notifyListeners(cacheKey, value);
      resolve(value);
    });
  });
}
