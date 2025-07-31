export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T | T[]) {
    if (Array.isArray(item)) {
      this.items.push(...item);
    } else {
      this.items.push(item);
    }
  }

  dequeue(): T | null {
    return this.items.shift() || null;
  }

  peek(): T | null {
    if (this.isEmpty) {
      return null;
    } else {
      return this.items[0];
    }
  }

  get size(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }
}

export class AutomaticQueue<T> {
  private queue = new Queue<T>();
  private mutex = false;
  private resolveEmpty: ((value: void | PromiseLike<void>) => void)[] = [];

  constructor(private readonly handler: (item: T) => Promise<void>) {}

  enqueue(item: T | T[]) {
    this.queue.enqueue(item);
    this.handle();
  }

  get isEmpty(): boolean {
    return this.queue.isEmpty;
  }

  async onEmpty(): Promise<void> {
    if (!this.queue.isEmpty) {
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
      item = this.queue.dequeue();
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
