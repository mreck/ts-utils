import { Queue } from "./queue";

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
