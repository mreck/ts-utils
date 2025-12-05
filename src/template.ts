export function querySelectTemplate(query: string): HTMLTemplateElement | null {
  // @TODO: allow for custom parent

  const el = document.querySelector(query);
  if (el === null || !(el instanceof HTMLTemplateElement)) {
    return null;
  }

  return el;
}

export function appendTemplate(
  parent: Element,
  template: HTMLTemplateElement,
  data: { query: string; attrs: Record<string, string> }[],
): DocumentFragment | Error {
  const root = document.importNode(template.content, true);

  for (const d of data) {
    const el = root.querySelector(d.query);
    if (el === null) {
      return new Error(`could not find element with query: ${d.query}`);
    }

    for (const attr in d.attrs) {
      el.setAttribute(attr, d.attrs[attr]);
    }
  }

  parent.appendChild(root);
  return root;
}
