import { querySelectAllHTML, querySelectHTML } from "./query-select";

export type TemplateData = ({ query: string } | { queryAll: string }) & {
  attrs?: Record<string, string>;
  innerHTML?: string;
  innerText?: string;
};

export function appendTemplate(
  parent: Element,
  template: HTMLTemplateElement,
  data: TemplateData[],
): DocumentFragment | Error {
  const root = document.importNode(template.content, true);

  for (const d of data) {
    let els: HTMLElement[];

    if ("query" in d) {
      const el = querySelectHTML(d.query, root);
      if (el === null) {
        return new Error(`could not find HTML element with query: ${d.query}`);
      }
      els = [el];
    } else {
      const el = querySelectAllHTML(d.queryAll, root);
      if (el === null) {
        return new Error(
          `could not find HTML element with queryAll: ${d.queryAll}`,
        );
      }
      els = Array.from(el);
    }

    for (const el of els) {
      for (const attr in d.attrs) {
        el.setAttribute(attr, d.attrs[attr]);
      }
    }

    if (d.innerHTML) {
      for (const el of els) {
        el.innerHTML = d.innerHTML;
      }
    }

    if (d.innerText) {
      for (const el of els) {
        el.innerText = d.innerText;
      }
    }
  }

  parent.appendChild(root);
  return root;
}
