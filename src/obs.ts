export interface ObsStorage<T> {
  load(): T;
  save(data: T): void;
}

export class Obs<T> {
  private cbs: ((newValue: T, oldValue: T, obs: this) => void)[] = [];

  constructor(
    private value: T,
    private opts?: {
      transform?: (value: T) => T;
      storage?: ObsStorage<T>;
    },
  ) {
    this.set(value);
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): this {
    const oldValue = this.value;
    this.value = this.opts?.transform?.(newValue) ?? newValue;
    this.opts?.storage?.save(this.value);
    this.notifty(this.value, oldValue);
    return this;
  }

  update(fn: (oldValue: T) => T): this {
    return this.set(fn(this.value));
  }

  up = this.update;

  subscribe(cb: (newValue: T, oldValue: T, obs: this) => void): () => void {
    this.cbs.push(cb);
    return () => this.unsubscribe(cb);
  }

  sub = this.subscribe;

  unsubscribe(cb: (newValue: T, oldValue: T, obs: this) => void) {
    const idx = this.cbs.findIndex((f) => f === cb);
    if (idx > -1) this.cbs.splice(idx, 1);
  }

  unsub = this.unsubscribe;

  private notifty(newValue: T, oldValue: T) {
    for (const cb of this.cbs) cb(newValue, oldValue, this);
  }
}
