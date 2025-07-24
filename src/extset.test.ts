import { ExtSet } from "./extset";

test("getValues()", () => {
  const s = new ExtSet<number>();

  s.add(1).add(2).add(2).add(1).add(3);
  expect(s.getValues().sort()).toEqual([1, 2, 3]);
});

test("addMany()", () => {
  const s = new ExtSet<number>();

  s.addMany([1, 2, 1, 3, 4, 2, 1, 5]);
  expect(s.getValues().sort()).toEqual([1, 2, 3, 4, 5]);

  s.addMany([1, 3, 5, 7, 9]);
  expect(s.getValues().sort()).toEqual([1, 2, 3, 4, 5, 7, 9]);
});
