export function getRetryableCachedPromise<TKey, TValue>(
  cache: Map<TKey, Promise<TValue>>,
  key: TKey,
  load: () => Promise<TValue>,
): Promise<TValue> {
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = Promise.resolve().then(load);
  cache.set(key, promise);
  void promise.catch(() => {
    if (cache.get(key) === promise) cache.delete(key);
  });
  return promise;
}
