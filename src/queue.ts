export interface Queue<T> {
  enqueue: (item: T | T[]) => Promise<void>;
  dequeue: () => Promise<T | null>;
  peek: () => Promise<T | null>;
  size: () => Promise<number>;
  isEmpty: () => Promise<boolean>;
}

export class SimpleQueue<T> implements Queue<T> {
  private items: T[] = [];

  async enqueue(item: T | T[]) {
    if (Array.isArray(item)) {
      this.items.push(...item);
    } else {
      this.items.push(item);
    }
  }

  async dequeue() {
    return this.items.shift() || null;
  }

  async peek() {
    if (this.items.length === 0) {
      return null;
    } else {
      return this.items[0];
    }
  }

  async size() {
    return this.items.length;
  }

  async isEmpty() {
    return this.items.length === 0;
  }
}

export class AutomaticQueue<T> {
  private mutex = false;
  private resolveEmpty: ((value: void | PromiseLike<void>) => void)[] = [];

  constructor(
    private readonly handler: (item: T) => Promise<void>,
    private readonly queue: Queue<T> = new SimpleQueue(),
  ) {}

  async enqueue(item: T | T[]) {
    this.queue.enqueue(item);
    this.handle();
  }

  async isEmpty() {
    return this.queue.isEmpty();
  }

  async onEmpty(): Promise<void> {
    if (!(await this.isEmpty())) {
      return new Promise((resolve) => {
        this.resolveEmpty.push(resolve);
      });
    }
  }

  private async handle() {
    if (this.mutex) {
      return;
    }

    this.mutex = true;

    let item: null | T = null;
    do {
      item = await this.queue.dequeue();
      if (item !== null) {
        await this.handler(item);
      }
    } while (item !== null);

    this.mutex = false;

    let cb: ((value: void | PromiseLike<void>) => void) | undefined;
    do {
      cb = this.resolveEmpty.shift();
      if (cb) {
        cb();
      }
    } while (cb !== undefined);
  }
}
