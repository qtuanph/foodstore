import { redis } from "./redis";

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Get value from Redis cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Set value in Redis cache with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  options: { ttl?: number; tags?: string[] } = {}
): Promise<void> {
  const { ttl = DEFAULT_TTL, tags = [] } = options;
  try {
    const pipeline = redis.pipeline();
    pipeline.setex(key, ttl, JSON.stringify(value));
    for (const tag of tags) {
      pipeline.sadd(`cache:tag:${tag}`, key);
      pipeline.expire(`cache:tag:${tag}`, ttl + 60);
    }
    await pipeline.exec();
  } catch {
    // Silently fail - cache is optional
  }
}

/**
 * Invalidate all keys matching a tag
 */
export async function invalidateTag(tag: string): Promise<void> {
  try {
    const keys = await redis.smembers(`cache:tag:${tag}`);
    if (keys.length > 0) {
      const pipeline = redis.pipeline();
      pipeline.del(...keys);
      pipeline.del(`cache:tag:${tag}`);
      await pipeline.exec();
    }
  } catch {
    // Silently fail
  }
}

/**
 * Invalidate multiple tags
 */
export async function invalidateTags(...tags: string[]): Promise<void> {
  await Promise.all(tags.map(invalidateTag));
}

/**
 * Remember pattern: get from cache or compute and store
 */
export async function remember<T>(
  key: string,
  ttl: number,
  callback: () => Promise<T>,
  tags: string[] = []
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) return cached;

  const value = await callback();
  await setCache(key, value, { ttl, tags });
  return value;
}

/**
 * Delete a specific key from cache
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    // Silently fail
  }
}

/**
 * Check if Redis is connected
 */
export async function isRedisConnected(): Promise<boolean> {
  try {
    const pong = await redis.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
}
