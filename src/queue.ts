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
