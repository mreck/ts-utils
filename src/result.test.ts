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

  describe("catchAsyncResult", () => {
    let sfn = 0;
    let efn = 0;
    const sf = () => {
      ++sfn;
      return "s";
    };
    const ef = () => {
      ++efn;
      throw "e";
    };

    test("without reties", async () => {
      sfn = 0;
      efn = 0;

      expect(await catchAsyncResult(sf)).toEqual(s);
      expect(sfn).toEqual(1);

      expect(await catchAsyncResult(ef)).toEqual(e);
      expect(efn).toEqual(1);
    });

    test("with reties", async () => {
      sfn = 0;
      efn = 0;
      const opts = { retries: 3 };

      expect(await catchAsyncResult(sf, opts)).toEqual(s);
      expect(sfn).toEqual(1);

      expect(await catchAsyncResult(ef, opts)).toEqual(e);
      expect(efn).toEqual(4);
    });
  });
});
