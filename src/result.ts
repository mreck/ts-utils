import { coerceError } from "./error";

class ResultBase<T> {
  isError(): this is ResultError<T> {
    return this instanceof ResultError;
  }

  isSuccess(): this is ResultSuccess<T> {
    return this instanceof ResultSuccess;
  }

  unwrap(): T {
    if (this.isSuccess()) {
      return this.data;
    }
    if (this.isError()) {
      throw this.error;
    }
    throw new Error("can not unwrap ResultBase");
  }
}

export class ResultError<T> extends ResultBase<T> {
  constructor(readonly error: Error) {
    super();
  }

  static coerce<T>(value: unknown): ResultError<T> {
    return new ResultError(coerceError(value));
  }
}

export class ResultSuccess<T> extends ResultBase<T> {
  constructor(readonly data: T) {
    super();
  }

  flatten(): ResultSuccess<T> {
    if (this.data instanceof ResultSuccess) {
      return this.data.flatten();
    }
    return this;
  }
}

export type Result<T> = ResultError<T> | ResultSuccess<T>;

export type AsyncResult<T> = Promise<ResultError<T> | ResultSuccess<T>>;

export function isResult<T>(val: unknown): val is Result<T> {
  return val instanceof ResultBase;
}

export async function catchAsyncResult<T>(
  fn: () => T | Result<T> | AsyncResult<T>,
  opts?: { retries?: number },
): AsyncResult<T> {
  const retries = Math.max(0, opts?.retries ?? 0);
  let result: Result<T> = ResultError.coerce("out of retries");

  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fn();
      result = isResult(r) ? r : new ResultSuccess(r);
      if (result.isSuccess()) {
        break;
      }
    } catch (error) {
      result = ResultError.coerce(error);
    }
  }

  return result;
}
