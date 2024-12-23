export const ErrUnknownCoercionFailed = new Error(
  "unknown Error: coercing failed",
);

export function coerceError(val: unknown): Error {
  if (val instanceof Error) {
    return val;
  }

  if (typeof val === "string") {
    return new Error(val);
  }

  if (
    typeof val === "object" &&
    "message" in val &&
    typeof val.message === "string"
  ) {
    const err = new Error(val.message);

    if ("name" in val && typeof val.name === "string") {
      err.name = val.name;
    }

    if ("stack" in val && typeof val.stack === "string") {
      err.stack = val.stack;
    }

    return err;
  }

  return ErrUnknownCoercionFailed;
}
