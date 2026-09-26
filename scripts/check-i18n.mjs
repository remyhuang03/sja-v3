import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createTranslator } from "next-intl";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const catalogs = Object.fromEntries(
  ["zh", "zh-Hant", "en", "ja"].map((locale) => [
    locale,
    read(`messages/${locale}.json`),
  ]),
);
const variables = (value) =>
  [
    ...new Set(
      [...value.matchAll(/\{(\w+)(?:[,}])/g)].map((match) => match[1]),
    ),
  ].sort();
for (const [locale, messages] of Object.entries(catalogs)) {
  assert.deepEqual(
    Object.keys(messages).sort(),
    Object.keys(catalogs.zh).sort(),
  );
  const t = createTranslator({
    locale,
    messages,
    onError: (error) => {
      throw error;
    },
  });
  for (const [namespace, entries] of Object.entries(catalogs.zh)) {
    assert.deepEqual(
      Object.keys(messages[namespace]).sort(),
      Object.keys(entries).sort(),
      `${locale}.${namespace}: key mismatch`,
    );
    for (const [key, original] of Object.entries(entries)) {
      const value = messages[namespace][key];
      assert.equal(typeof value, "string");
      assert.ok(value.trim(), `${locale}.${namespace}.${key}: empty message`);
      if (namespace === "articles") continue; // Markdown articles use t.raw(), not ICU formatting.
      assert.deepEqual(
        variables(value),
        variables(original),
        `${locale}.${namespace}.${key}: interpolation mismatch`,
      );
      t(
        `${namespace}.${key}`,
        Object.fromEntries(variables(value).map((name) => [name, 2])),
      );
    }
  }
}
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? walk(path)
      : /\.tsx?$/.test(path)
        ? [path]
        : [];
  });
}
for (const path of walk("app")) {
  const source = readFileSync(path, "utf8");
  for (const match of source.matchAll(/\bt\(['"]([^'"]+)['"]/g)) {
    assert.ok(
      match[1] in catalogs.zh.ui,
      `${path}: unknown UI key ${match[1]}`,
    );
  }
}
for (const item of read("data/news/news-info.json")) {
  for (const key of [item.titleKey, item.descriptionKey])
    assert.ok(key in catalogs.zh.content, `Missing news key ${key}`);
  assert.ok(
    item.article in catalogs.zh.articles,
    `Missing article ${item.article}`,
  );
}
for (const category of Object.keys(read("data/nav/cates.json")))
  assert.ok(`category_${category}` in catalogs.zh.content);
for (const release of read("data/update-log/log.json")) {
  for (const item of release.update) {
    assert.ok(
      (Array.isArray(item) ? item[1] : item) in catalogs.zh.content,
      `Missing release message for ${release.version}`,
    );
    if (Array.isArray(item)) assert.ok(`change_${item[0]}` in catalogs.zh.ui);
  }
}
console.log(
  "Simplified Chinese, Traditional Chinese, English, and Japanese catalogs and source references are valid.",
);
