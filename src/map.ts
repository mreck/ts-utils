export class ExtMap<K, V> extends Map<K, V> {
  getKeys(): K[] {
    return Array.from(this.keys());
  }

  getValues(): V[] {
    return Array.from(this.values());
  }

  getKeysAndValues(): [K, V][] {
    const result: [K, V][] = [];
    for (const data of this) {
      result.push(data);
    }
    return result;
  }

  setMany(entires: readonly (readonly [K, V])[]): this {
    for (const [key, val] of entires) {
      this.set(key, val);
    }
    return this;
  }

  update(key: K, fn: (val: V | undefined) => V): this {
    this.set(key, fn(this.get(key)));
    return this;
  }

  updateAll(fn: (val: V | undefined) => V): this {
    for (const [key, val] of this) {
      this.set(key, fn(val));
    }
    return this;
  }
}

export class ExtUniqueMap<K, V> extends ExtMap<K, V> {
  set(key: K, val: V): this {
    if (this.get(key) !== undefined) {
      console.error(`unique contraint violated! key: ${key}`);
    }
    return super.set(key, val);
  }
}

export class ExtArrayMap<K, V> extends ExtMap<K, V[]> {
  add(key: K, val: V): this {
    return this.set(key, [...(this.get(key) || []), val]);
  }
}
