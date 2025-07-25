import { catchAsyncResult, ResultError, ResultSuccess } from "./result";

test("ResultError", () => {
  const e = ResultError.coerce("e");

  expect(e.isError()).toBe(true);
  expect(e.isSuccess()).toBe(false);
  expect(() => e.unwrap()).toThrow("e");
});

test("ResultSuccess", () => {
  const s = new ResultSuccess("s");
  const sss = new ResultSuccess(new ResultSuccess(new ResultSuccess("s")));

  expect(s.isError()).toBe(false);
  expect(s.isSuccess()).toBe(true);
  expect(s.unwrap()).toBe("s");
  expect(sss.flatten()).toEqual(s);
});

describe("catchAsyncResult", () => {
  const s = new ResultSuccess("s");
  const e = ResultError.coerce("e");

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
