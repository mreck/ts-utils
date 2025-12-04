import { ExtSet } from "./extset";

const expectExtSetValues = <T>(s: ExtSet<T>, values: T[]) =>
  expect(s.getValues().sort()).toEqual(values);

test("toggle()", () => {
  const s = new ExtSet<number>([1, 2, 3]);

  s.toggle(2);
  expectExtSetValues(s, [1, 3]);

  s.toggle(2);
  expectExtSetValues(s, [1, 2, 3]);
});

test("getValues()", () => {
  const s = new ExtSet<number>();

  s.add(1).add(2).add(2).add(1).add(3);
  expectExtSetValues(s, [1, 2, 3]);
});

test("hasAny()", () => {
  const s = new ExtSet<number>([1, 2, 3, 4]);

  expect(s.hasAny([3, 5])).toBe(true);
  expect(s.hasAny([5, 6])).toBe(false);
});

test("hasAll()", () => {
  const s = new ExtSet<number>([1, 2, 3, 4]);

  expect(s.hasAll([3, 4])).toBe(true);
  expect(s.hasAll([4, 5])).toBe(false);
});

test("addMany()", () => {
  const s = new ExtSet<number>();

  s.addMany([1, 2, 1, 3, 4, 2, 1, 5]);
  expectExtSetValues(s, [1, 2, 3, 4, 5]);

  s.addMany([1, 3, 5, 7, 9]);
  expectExtSetValues(s, [1, 2, 3, 4, 5, 7, 9]);
});

test("deleteMany()", () => {
  const s = new ExtSet<number>([1, 2, 3, 4, 5, 6, 7]);

  s.deleteMany([1, 3, 5, 7]);
  expectExtSetValues(s, [2, 4, 6]);
});

test("toggleMany()", () => {
  const s = new ExtSet<number>([1, 2, 3]);

  s.toggleMany([3, 4]);
  expectExtSetValues(s, [1, 2, 4]);

  s.toggleMany([3, 4]);
  expectExtSetValues(s, [1, 2, 3]);
});
