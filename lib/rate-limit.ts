type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim().slice(0, 120) || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim().slice(0, 120) || "unknown";
}

export function getRateLimitKey(request: Request) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get("user-agent")?.trim().slice(0, 160) || "unknown";

  return `${clientIp}:${userAgent}`;
}

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (buckets.size > 1000) {
    for (const [bucketKey, bucket] of buckets.entries()) {
      if (bucket.resetAt <= now) {
        buckets.delete(bucketKey);
      }
    }
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return false;
  }

  if (bucket.count >= limit) {
    return true;
  }

  bucket.count += 1;
  return false;
}
