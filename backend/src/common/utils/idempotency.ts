const executedKeys = new Map<string, Promise<unknown>>();

export async function runOnce<T>(key: string, handler: () => Promise<T>): Promise<T> {
  if (executedKeys.has(key)) {
    return executedKeys.get(key) as Promise<T>;
  }
  const promise = handler();
  executedKeys.set(key, promise);
  return promise;
}
