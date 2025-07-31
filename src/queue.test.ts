import { sleep } from "./misc";
import { AutomaticQueue, SimpleQueue } from "./queue";

test("SimpleQueue", async () => {
  const q = new SimpleQueue<number>();

  expect(await q.size()).toBe(0);
  expect(await q.isEmpty()).toBe(true);
  expect(await q.peek()).toBe(null);

  await q.enqueue(1);

  expect(await q.size()).toBe(1);
  expect(await q.isEmpty()).toBe(false);
  expect(await q.peek()).toBe(1);

  await q.enqueue([2, 3]);

  expect(await q.size()).toBe(3);
  expect(await q.isEmpty()).toBe(false);
  expect(await q.peek()).toBe(1);

  expect(await q.dequeue()).toBe(1);
  expect(await q.size()).toBe(2);
  expect(await q.isEmpty()).toBe(false);
  expect(await q.peek()).toBe(2);

  expect(await q.dequeue()).toBe(2);
  expect(await q.size()).toBe(1);
  expect(await q.isEmpty()).toBe(false);
  expect(await q.peek()).toBe(3);

  expect(await q.dequeue()).toBe(3);
  expect(await q.size()).toBe(0);
  expect(await q.isEmpty()).toBe(true);
  expect(await q.peek()).toBe(null);

  expect(await q.dequeue()).toBe(null);
});

test("AutomaticQueue", async () => {
  const dequeued: number[] = [];

  const cb = async (item: number) => {
    await sleep(item * 20);
    dequeued.push(item);
  };

  const q = new AutomaticQueue<number>(cb);

  expect(await q.isEmpty()).toBe(true);

  await q.enqueue([5, 4, 3]);
  await q.enqueue([2, 1]);

  expect(await q.isEmpty()).toBe(false);

  await q.onEmpty();
  await q.onEmpty();

  expect(await q.isEmpty()).toBe(true);

  await q.onEmpty();

  expect(dequeued).toEqual([5, 4, 3, 2, 1]);

  await q.enqueue([2, 1]);

  expect(await q.isEmpty()).toBe(false);

  await q.onEmpty();

  expect(dequeued).toEqual([5, 4, 3, 2, 1, 2, 1]);
});
