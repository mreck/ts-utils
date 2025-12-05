import { ErrUnknownCoercionFailed, coerceError } from "./error";

const isErr = (val: unknown) => val instanceof Error;

test("coerceError()", () => {
  {
    const res = coerceError("test");
    expect(isErr(res)).toBe(true);
    expect(res.message).toEqual("test");
  }
  {
    const err = new Error("test");
    const res = coerceError(err);
    expect(res).toBe(err);
  }
  {
    const res = coerceError({ message: "test" });
    expect(isErr(res)).toBe(true);
    expect(res.message).toEqual("test");
  }
  {
    const res = coerceError({ message: "test", name: "foobar" });
    expect(isErr(res)).toBe(true);
    expect(res.message).toEqual("test");
    expect(res.name).toEqual("foobar");
  }
  {
    const res = coerceError({ message: "test", stack: "foobar" });
    expect(isErr(res)).toBe(true);
    expect(res.message).toEqual("test");
    expect(res.stack).toEqual("foobar");
  }
  {
    const res = coerceError(1);
    expect(res).toBe(ErrUnknownCoercionFailed);
  }
});
