export function zip<A, B>(
  a: A[],
  b: B[],
): ([A, B] | [A | undefined, B] | [A, B | undefined])[] {
  const result: [A, B][] = [];
  const len = Math.max(a.length, b.length);

  for (let i = 0; i < len; i++) {
    result.push([a[i], b[i]]);
  }

  return result;
}
