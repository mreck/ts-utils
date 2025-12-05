export function querySelectTemplate(
  query: string,
  parent: ParentNode = document,
): HTMLTemplateElement | null {
  const el = parent.querySelector(query);
  if (el === null || !(el instanceof HTMLTemplateElement)) {
    return null;
  }

  return el;
}

export function querySelectHTML(
  query: string,
  parent: ParentNode = document,
): HTMLElement | null {
  const el = parent.querySelector(query);
  if (el === null || !(el instanceof HTMLElement)) {
    return null;
  }

  return el;
}

export function querySelectAllHTML(
  query: string,
  parent: ParentNode = document,
): HTMLElement[] {
  const el = parent.querySelectorAll(query);
  if (el === null) {
    return [];
  }

  const result: HTMLElement[] = [];
  for (const it of el) {
    if (it instanceof HTMLElement) {
      result.push(it);
    }
  }

  return result;
}
