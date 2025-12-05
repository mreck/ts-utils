export function querySelectTemplate(query: string): HTMLTemplateElement | null {
  // @TODO: allow for custom parent

  const el = document.querySelector(query);
  if (el === null || !(el instanceof HTMLTemplateElement)) {
    return null;
  }

  return el;
}

export type TemplateData = ({ query: string } | { queryAll: string }) & {
  attrs?: Record<string, string>;
};

export function appendTemplate(
  parent: Element,
  template: HTMLTemplateElement,
  data: TemplateData[],
): DocumentFragment | Error {
  const root = document.importNode(template.content, true);

  for (const d of data) {
    let els: Element[];

    if ("query" in d) {
      const el = root.querySelector(d.query);
      if (el === null) {
        return new Error(`could not find element with query: ${d.query}`);
      }
      els = [el];
    } else {
      const el = root.querySelectorAll(d.queryAll);
      if (el === null) {
        return new Error(`could not find element with queryAll: ${d.queryAll}`);
      }
      els = Array.from(el);
    }

    for (const el of els) {
      for (const attr in d.attrs) {
        el.setAttribute(attr, d.attrs[attr]);
      }
    }
  }

  parent.appendChild(root);
  return root;
}
