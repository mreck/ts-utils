export async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function assert<T>(value: T | null | undefined | Error): T {
  if (value === undefined || value === null) {
    throw new Error(`demand not met: ${value}`);
  }
  if (value instanceof Error) {
    throw value;
  }
  return value;
}
