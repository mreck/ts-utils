import { Obs } from "./obs";

test("Obs", async () => {
  const o = new Obs(0);
  const v: [number, number][] = [];

  expect(o.get()).toBe(0);
  expect(o.set(1).get()).toBe(1);

  const unsub = o.subscribe((nv, ov) => v.push([nv, ov]));

  o.set(2).set(3);

  expect(v).toStrictEqual([
    [2, 1],
    [3, 2],
  ]);

  unsub();

  expect(o.set(4).get()).toBe(4);

  expect(v).toStrictEqual([
    [2, 1],
    [3, 2],
  ]);

  expect(o.update((n) => n * 2).get()).toBe(8);
});
