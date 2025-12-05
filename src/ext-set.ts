export class ExtSet<T> extends Set<T> {
  clone(): ExtSet<T> {
    return new ExtSet(this);
  }

  toggle(value: T): this {
    if (this.has(value)) {
      this.delete(value);
    } else {
      this.add(value);
    }
    return this;
  }

  getValues(): T[] {
    return Array.from(this.values());
  }

  hasAny(values: T[]): boolean {
    for (const value of values) {
      if (this.has(value)) {
        return true;
      }
    }
    return false;
  }

  hasAll(values: T[]): boolean {
    for (const value of values) {
      if (!this.has(value)) {
        return false;
      }
    }
    return true;
  }

  addMany(values: T[]): this {
    for (const value of values) {
      this.add(value);
    }
    return this;
  }

  deleteMany(values: T[]): this {
    for (const value of values) {
      this.delete(value);
    }
    return this;
  }

  toggleMany(values: T[]): this {
    for (const value of values) {
      this.toggle(value);
    }
    return this;
  }
}
