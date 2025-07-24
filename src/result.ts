import { coerceError } from "./error";

export interface ResultError {
  _t: -1;
  error: Error;
}

export interface ResultSuccess<T> {
  _t: 1;
  data: T;
}

export type Result<T> = ResultError | ResultSuccess<T>;

export type AsyncResult<T> = Promise<ResultError | ResultSuccess<T>>;

export function isError<T>(result: Result<T>): result is ResultError {
  return result._t === -1;
}

export function isSuccess<T>(result: Result<T>): result is ResultSuccess<T> {
  return result._t === 1;
}

export function unwrapResult<T>(res: Result<T>) {
  if (isError(res)) {
    throw res.error;
  }
  return res.data;
}

export function newResultError(error: Error): ResultError {
  return { _t: -1, error };
}

export function newResultSuccess<T>(data: T): ResultSuccess<T> {
  return { _t: 1, data };
}

export function coerceResultError(value: unknown): ResultError {
  return newResultError(coerceError(value));
}

export async function catchAsyncResult<T>(
  fn: () => T,
  opts?: { retries?: number },
): AsyncResult<T> {
  const retries = Math.max(0, opts?.retries ?? 0);
  let result: Result<T> = coerceResultError("out of retries");

  for (let i = 0; i <= retries; i++) {
    try {
      result = newResultSuccess(await fn());
      break;
    } catch (error) {
      result = coerceResultError(error);
    }
  }

  return result;
}
