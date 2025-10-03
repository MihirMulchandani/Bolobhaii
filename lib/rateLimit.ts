// Simple in-memory rate limiter keyed by identity or IP.
// NOTE: In multi-instance deployments, replace this with Redis. Use a key like `rate:{key}` with TTL.

type Entry = { ts: number }
const lastHit = new Map<string, Entry>()

export function checkRateLimit(key: string, windowMs: number): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  const prev = lastHit.get(key)
  if (!prev) {
    lastHit.set(key, { ts: now })
    return { allowed: true, retryAfterMs: 0 }
  }
  const diff = now - prev.ts
  if (diff >= windowMs) {
    lastHit.set(key, { ts: now })
    return { allowed: true, retryAfterMs: 0 }
  }
  return { allowed: false, retryAfterMs: windowMs - diff }
}


