type CacheEntry<T> = {
  data: T;
  expires: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 60_000; // 1 minute

/**
 * Client-side cache: fetch with TTL.
 * Avoids re-fetching same data within a session.
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expires > Date.now()) {
    return entry.data;
  }

  const data = await fetcher();
  cache.set(key, { data, expires: Date.now() + ttl });
  return data;
}

/**
 * Invalidate a specific cache key
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Invalidate all keys matching a prefix
 */
export function invalidateCachePrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear entire cache
 */
export function clearCache(): void {
  cache.clear();
}
