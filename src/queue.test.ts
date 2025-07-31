import { sleep } from "./misc";
import { AutomaticQueue, Queue } from "./queue";

test("Queue", () => {
  const q = new Queue<number>();

  expect(q.size).toBe(0);
  expect(q.isEmpty).toBe(true);
  expect(q.peek()).toBe(null);

  q.enqueue(1);

  expect(q.size).toBe(1);
  expect(q.isEmpty).toBe(false);
  expect(q.peek()).toBe(1);

  q.enqueue([2, 3]);

  expect(q.size).toBe(3);
  expect(q.isEmpty).toBe(false);
  expect(q.peek()).toBe(1);

  expect(q.dequeue()).toBe(1);
  expect(q.size).toBe(2);
  expect(q.isEmpty).toBe(false);
  expect(q.peek()).toBe(2);

  expect(q.dequeue()).toBe(2);
  expect(q.size).toBe(1);
  expect(q.isEmpty).toBe(false);
  expect(q.peek()).toBe(3);

  expect(q.dequeue()).toBe(3);
  expect(q.size).toBe(0);
  expect(q.isEmpty).toBe(true);
  expect(q.peek()).toBe(null);

  expect(q.dequeue()).toBe(null);
});

test("AutomaticQueue", async () => {
  const dequeued: number[] = [];

  const cb = async (item: number) => {
    await sleep(item * 20);
    dequeued.push(item);
  };

  const q = new AutomaticQueue<number>(cb);

  expect(q.isEmpty).toBe(true);

  q.enqueue([5, 4, 3]);
  q.enqueue([2, 1]);

  expect(q.isEmpty).toBe(false);

  await q.onEmpty();
  await q.onEmpty();

  expect(q.isEmpty).toBe(true);

  await q.onEmpty();

  expect(dequeued).toEqual([5, 4, 3, 2, 1]);

  q.enqueue([2, 1]);

  expect(q.isEmpty).toBe(false);

  await q.onEmpty();

  expect(dequeued).toEqual([5, 4, 3, 2, 1, 2, 1]);
});
