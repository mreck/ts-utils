import {
  catchAsyncResult,
  coerceResultError,
  isError,
  isSuccess,
  newResultSuccess,
  unwrapResult,
} from "./result";

describe("result", () => {
  const s = newResultSuccess("s");
  const e = coerceResultError("e");

  test("isSuccess()", () => {
    expect(isSuccess(s)).toBe(true);
    expect(isSuccess(e)).toBe(false);
  });

  test("isError()", () => {
    expect(isError(s)).toBe(false);
    expect(isError(e)).toBe(true);
  });

  test("unwrapResult()", () => {
    expect(unwrapResult(s)).toEqual("s");
    expect(() => unwrapResult(e)).toThrow("e");
  });

  test("catchAsyncResult", async () => {
    expect(await catchAsyncResult(() => "s")).toEqual(s);
    expect(
      await catchAsyncResult(() => {
        throw "e";
      }),
    ).toEqual(e);
  });
});
