import { ExtUniqueMap } from "./map";

export interface TreeNodeObject<K extends number | string, T> {
  readonly key: K;
  data: T;
  children: TreeNodeObject<K, T>[];
}

export class TreeNode<K extends number | string, T> {
  constructor(
    public readonly key: K,
    public data: T,
    public parent: TreeNode<K, T> | null = null,
    public children: TreeNode<K, T>[] = [],
    public tree: Tree<K, T> | null = null,
  ) {}

  toObject(): TreeNodeObject<K, T> {
    return {
      key: this.key,
      data: this.data,
      children: this.children.map((child) => child.toObject()),
    };
  }

  private static fromObjectImpl<K extends number | string, T>(
    root: TreeNodeObject<K, T>,
    parent: TreeNode<K, T> | null,
  ): TreeNode<K, T> {
    const result = new TreeNode(root.key, root.data, parent, []);
    result.children = root.children.map((node) => TreeNode.fromObjectImpl(node, result));
    return result;
  }

  static fromObject<K extends number | string, T>(root: TreeNodeObject<K, T>): TreeNode<K, T> {
    return TreeNode.fromObjectImpl(root, null);
  }

  get firstChild(): TreeNode<K, T> | null {
    return this.children.length === 0 ? null : this.children[0];
  }

  get lastChild(): TreeNode<K, T> | null {
    return this.children.length === 0 ? null : this.children[this.children.length - 1];
  }

  addChildNode(node: TreeNode<K, T>): TreeNode<K, T> {
    node.parent = this;
    node.tree = this.tree;

    this.children.push(node);
    this.tree?.keyMap.set(node.key, node);

    return node;
  }

  addChild(key: K, data: T, children: TreeNode<K, T>[] = []): TreeNode<K, T> {
    const node = new TreeNode<K, T>(key, data, this, children);
    node.tree = this.tree;

    this.children.push(node);
    this.tree?.keyMap.set(node.key, node);

    return node;
  }

  removeChild(key: K): TreeNode<K, T> | null {
    const idx = this.children.findIndex((node) => node.key === key);
    if (idx < 0) {
      return null;
    }

    const removedNode = this.children[idx];
    this.children.splice(idx, 1);
    if (this.tree) {
      removedNode.traverse((node) => this.tree?.keyMap.delete(node.key));
    }

    return removedNode;
  }

  traverse(fn: (node: TreeNode<K, T>) => void) {
    fn(this);
    for (const child of this.children) {
      child.traverse(fn);
    }
  }

  traverseUp(fn: (node: TreeNode<K, T>) => void) {
    fn(this);
    this.parent?.traverseUp(fn);
  }

  find(fn: (node: TreeNode<K, T>) => boolean): TreeNode<K, T> | null {
    if (fn(this)) {
      return this;
    }
    for (const child of this.children) {
      const res = child.find(fn);
      if (res) {
        return res;
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

export class Tree<K extends number | string, T> {
  public keyMap = new ExtUniqueMap<K, TreeNode<K, T>>();

  constructor(public root: TreeNode<K, T>) {
    this.root.traverse((node) => {
      node.tree = this;
      this.keyMap.set(node.key, node);
    });
  }
}
