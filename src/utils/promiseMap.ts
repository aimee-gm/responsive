export function promiseMap<T, U>(
  arr: T[],
  iterator: (input: T, index: number) => Promise<U>
): Promise<U[]> {
  return Promise.all(arr.map(iterator));
}
