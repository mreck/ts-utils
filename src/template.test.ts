/**
 * @jest-environment jsdom
 */
import { assert } from "./misc";
import { querySelectTemplate } from "./query-select";
import { appendTemplate } from "./template";

const html1 = `
  <div id="root"></div>
  <template id="test">
    <div>foobar</div>
  </template>
` as const;

const html12 = `
  <div id="root"></div>
  <template id="test">
    <div>foobar</div><div>xaxaxa</div>
  </template>
` as const;

describe("appendTemplate", () => {
  test("empty data", () => {
    document.body.innerHTML = html1;

    const root = assert(document.querySelector("#root"));
    const tmpl = assert(querySelectTemplate("#test"));

    const result = appendTemplate(root, tmpl, []);

    expect(result).not.toBeInstanceOf(Error);
    expect(assert(document.querySelector("#root")).innerHTML.trim()).toEqual(
      `<div>foobar</div>`,
    );
  });

  test("bad query", () => {
    document.body.innerHTML = html1;

    const root = assert(document.querySelector("#root"));
    const tmpl = assert(querySelectTemplate("#test"));

    const result = appendTemplate(root, tmpl, [
      { query: "img", attrs: { id: "baz" } },
    ]);

    expect(result).toBeInstanceOf(Error);
  });

  test("query with attrs", () => {
    document.body.innerHTML = html1;

    const root = assert(document.querySelector("#root"));
    const tmpl = assert(querySelectTemplate("#test"));

    const result = appendTemplate(root, tmpl, [
      { query: "div", attrs: { id: "baz" } },
    ]);

    expect(result).not.toBeInstanceOf(Error);
    expect(assert(document.querySelector("#root")).innerHTML.trim()).toEqual(
      `<div id="baz">foobar</div>`,
    );
  });

  test("queryAll with attrs", () => {
    document.body.innerHTML = html12;

    const root = assert(document.querySelector("#root"));
    const tmpl = assert(querySelectTemplate("#test"));

    const result = appendTemplate(root, tmpl, [
      { queryAll: "div", attrs: { class: "baz" } },
    ]);

    expect(result).not.toBeInstanceOf(Error);
    expect(assert(document.querySelector("#root")).innerHTML.trim()).toEqual(
      `<div class="baz">foobar</div><div class="baz">xaxaxa</div>`,
    );
  });
});
