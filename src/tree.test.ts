import { Tree, TreeNode } from "./tree";

const createTestTreeNodes = () => {
  const root = new TreeNode<number, number>(1, 1, null);
  root.addChild(2, 2);
  root.addChild(3, 3).addChild(4, 4).addChild(5, 5);
  return root;
};

describe("TreeNode", () => {
  test("toObject()", () => {
    const r = createTestTreeNodes();
    const o = r.toObject();

    expect(o).toEqual({
      key: 1,
      data: 1,
      children: [
        {
          key: 2,
          data: 2,
          children: [],
        },
        {
          key: 3,
          data: 3,
          children: [
            {
              key: 4,
              data: 4,
              children: [
                {
                  key: 5,
                  data: 5,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("fromObject()", () => {
    const r1 = createTestTreeNodes();
    const o = r1.toObject();
    const r2 = TreeNode.fromObject(o);

    const d1 = [];
    const d2 = [];

    r1.traverse((node) => d1.push([node.key, node.data, node.parent?.key]));
    r2.traverse((node) => d2.push([node.key, node.data, node.parent?.key]));

    expect(d1).toEqual(d2);
  });

  test("firstChild()", () => {
    const r = createTestTreeNodes();

    expect(r.firstChild).toBe(r.children[0]);
    expect(r.firstChild.firstChild).toBe(null);
  });

  test("lastChild()", () => {
    const r = createTestTreeNodes();

    expect(r.lastChild).toBe(r.children[1]);
    expect(r.firstChild.lastChild).toBe(null);
  });

  test("addChildNode()", () => {
    const r = createTestTreeNodes();
    const n = new TreeNode(6, 7);
    r.addChildNode(n);

    expect(r.lastChild).toBe(n);
    expect(r.lastChild.parent.key).toBe(r.key);
  });

  test("addChild()", () => {
    const r = createTestTreeNodes();
    r.addChild(6, 7);

    expect(r.lastChild.key).toBe(6);
    expect(r.lastChild.data).toBe(7);
    expect(r.lastChild.parent.key).toBe(r.key);
  });

  test("removeChild()", () => {
    const r = createTestTreeNodes();
    r.removeChild(2);
    r.removeChild(2);

    expect(r.children.length).toBe(1);
    expect(r.firstChild.key).toBe(3);
  });

  test("traverse()", () => {
    const r = createTestTreeNodes();
    const k = [];
    r.traverse((node) => k.push(node.key));

    expect(k).toEqual([1, 2, 3, 4, 5]);
  });

  test("traverseUp()", () => {
    const r = createTestTreeNodes().lastChild.lastChild.lastChild;
    const k = [];
    r.traverseUp((node) => k.push(node.key));

    expect(k).toEqual([5, 4, 3, 1]);
  });

  test("find()", () => {
    const r = createTestTreeNodes();
    const n1 = r.find((node) => node.key === 5);

    expect(n1.key).toBe(5);
    expect(n1.data).toBe(5);

    const n2 = r.find((node) => node.key === 99);
    expect(n2).toBe(null);
  });

  test("findUp()", () => {
    const r = createTestTreeNodes().lastChild.lastChild.lastChild;
    const n1 = r.findUp((node) => node.key === 1);

    expect(n1.key).toBe(1);
    expect(n1.data).toBe(1);

    const n2 = r.findUp((node) => node.key === 99);
    expect(n2).toBe(null);
  });
});

describe("TreeNode", () => {
  test("constructor()", () => {
    const r = createTestTreeNodes();
    const t = new Tree(r);

    expect(t.keyMap.getKeys().sort()).toEqual([1, 2, 3, 4, 5]);

    t.root.addChild(6, 6).addChild(7, 7);
    t.root.addChildNode(new TreeNode(8, 8)).addChildNode(new TreeNode(9, 9));

    expect(t.keyMap.getKeys().sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    t.root.removeChild(8);

    expect(t.keyMap.getKeys().sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
