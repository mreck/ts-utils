export class ExtSet<T> extends Set<T> {
  getValues(): T[] {
    return Array.from(this.values());
  }

  addMany(values: T[]): ExtSet<T> {
    for (const value of values) {
      this.add(value);
    }
    return this;
  }
}
