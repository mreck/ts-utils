export class Obs<T> {
  private cbs: ((newValue: T, oldValue: T, obs: this) => void)[] = [];

  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  set(newValue: T): this {
    const oldValue = this.value;
    this.value = newValue;
    this.notifty(this.value, oldValue);
    return this;
  }

  update(fn: (oldValue: T) => T): this {
    const oldValue = this.value;
    this.value = fn(oldValue);
    this.notifty(this.value, oldValue);
    return this;
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
