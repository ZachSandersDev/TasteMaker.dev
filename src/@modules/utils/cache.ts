export function getCachedValue<T>(cacheKey: string): T | undefined {
  return JSON.parse(sessionStorage.getItem(cacheKey) || "0") || undefined;
}