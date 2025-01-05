import { zip } from "./array";

test("zip()", () => {
  expect(zip([1, 2, 3], ["a", "b", "c"])).toEqual([
    [1, "a"],
    [2, "b"],
    [3, "c"],
  ]);

  expect(zip([1, 2], ["a", "b", "c"])).toEqual([
    [1, "a"],
    [2, "b"],
    [undefined, "c"],
  ]);

  expect(zip([1, 2, 3], ["a", "b"])).toEqual([
    [1, "a"],
    [2, "b"],
    [3, undefined],
  ]);
});
