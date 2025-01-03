import { ExtArrayMap, ExtMap, ExtUniqueMap } from "./map";

describe("ExtMap", () => {
  test("getKeys()", () => {
    const m = new ExtMap<number, number>();

    m.set(1, 2).set(3, 4).set(5, 6);

    expect(m.getKeys().sort()).toEqual([1, 3, 5]);
  });

  test("getValues()", () => {
    const m = new ExtMap<number, number>();

    m.set(1, 2).set(3, 4).set(5, 6);

    expect(m.getValues().sort()).toEqual([2, 4, 6]);
  });

  test("getKeysAndValues()", () => {
    const m = new ExtMap<number, number>();

    m.set(1, 2).set(3, 4).set(5, 6);

    expect(m.getKeysAndValues().sort((a, b) => a[0] - b[0])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  test("setMany()", () => {
    const m = new ExtMap<number, number>();

    m.setMany([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);

    expect(m.getKeysAndValues().sort((a, b) => a[0] - b[0])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  test("update()", () => {
    const m = new ExtMap<number, number>();

    m.set(1, 2).set(3, 4).set(5, 6);

    m.update(1, (v) => v * v);
    m.update(3, (v) => v * v);
    m.update(5, (v) => v * v);

    expect(m.getKeysAndValues().sort((a, b) => a[0] - b[0])).toEqual([
      [1, 2 * 2],
      [3, 4 * 4],
      [5, 6 * 6],
    ]);
  });

  test("updateAll()", () => {
    const m = new ExtMap<number, number>();

    m.set(1, 2).set(3, 4).set(5, 6);

    m.updateAll((v) => v * v);

    expect(m.getKeysAndValues().sort((a, b) => a[0] - b[0])).toEqual([
      [1, 2 * 2],
      [3, 4 * 4],
      [5, 6 * 6],
    ]);
  });
});

describe("ExtUniqueMap", () => {
  test("set()", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function

    const m = new ExtUniqueMap<number, number>();

    m.set(1, 1).set(2, 2).set(3, 3);
    m.set(1, 1).set(2, 2).set(3, 3);

    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });
});

describe("ExtArrayMap", () => {
  test("set()", () => {
    const m = new ExtArrayMap<number, number>();

    m.add(1, 1).add(1, 2).add(1, 3);
    m.add(2, 1).add(2, 2).add(2, 3);
    m.add(1, 4).add(1, 5).add(1, 6);

    expect(m.getKeysAndValues().sort((a, b) => a[0] - b[0])).toEqual([
      [1, [1, 2, 3, 4, 5, 6]],
      [2, [1, 2, 3]],
    ]);
  });
});
