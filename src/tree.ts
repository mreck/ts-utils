import { ExtUniqueMap } from "./map";

export class TreeNode<K, T> {
  constructor(
    public readonly key: K,
    public data: T,
    public parent: TreeNode<K, T> | null = null,
    public children: TreeNode<K, T>[] = [],
    public tree: Tree<K, T> | null = null,
  ) {}

  addChildNode(node: TreeNode<K, T>): TreeNode<K, T> {
    node.parent = this;
    this.children.push(node);
    this.tree?.keys.set(node.key, node);
    return node;
  }

  addChild(key: K, data: T, children: TreeNode<K, T>[] = []): TreeNode<K, T> {
    const node = new TreeNode<K, T>(key, data, this, children);
    this.children.push(node);
    this.tree?.keys.set(node.key, node);
    return node;
  }

  removeChild(key: K): TreeNode<K, T> | null {
    const idx = this.children.findIndex((node) => node.key === key);
    if (idx < 0) {
      return null;
    }

    const node = this.children[idx];
    this.children.splice(idx, 1);
    this.tree?.keys.delete(key);
    return node;
  }

  traverse(fn: (node: TreeNode<K, T>) => void) {
    fn(this);
    for (const child of this.children) {
      child.traverse(fn);
    }
  }

  traverseUp(fn: (node: TreeNode<K, T>) => void) {
    fn(this);
    this.parent?.traverse(fn);
  }

  find(fn: (node: TreeNode<K, T>) => boolean): TreeNode<K, T> | null {
    if (fn(this)) {
      return this;
    }
    for (const child of this.children) {
      if (child.find(fn)) {
        return child;
      }
    }
    return null;
  }

  findUp(fn: (node: TreeNode<K, T>) => boolean): TreeNode<K, T> | null {
    if (fn(this)) {
      return this;
    }
    return this.parent?.findUp(fn) || null;
  }
}

export class Tree<K, T> {
  public keys = new ExtUniqueMap<K, TreeNode<K, T>>();

  constructor(public root: TreeNode<K, T>) {
    this.keys.set(root.key, root);
  }
}
