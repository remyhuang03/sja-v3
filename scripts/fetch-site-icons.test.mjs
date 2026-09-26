import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import sharp from "sharp";
import { iconCandidates, fetchSiteIcon } from "./fetch-site-icons.mjs";

test("discovers declared icons with base URLs, entities, and safe schemes", () => {
  assert.deepEqual(
    iconCandidates(
      `
    <base href="/assets/"><link REL="shortcut ICON" href="logo.png?a=1&amp;b=2">
    <link rel="apple-touch-icon" href="//cdn.example.org/apple.png">
    <link rel="icon" href="javascript:alert(1)"><link rel="icon" href="data:image/svg+xml,abc">
    <link rel="icon" href="logo.png?a=1&amp;b=2">`,
      "https://example.org/editor/",
    ),
    [
      "https://example.org/assets/logo.png?a=1&b=2",
      "https://cdn.example.org/apple.png",
      "https://example.org/favicon.ico",
    ],
  );
});

test("follows redirects, skips invalid images, rasterizes SVG, and handles missing icons", async () => {
  const server = createServer((req, res) => {
    if (req.url === "/start") {
      res.writeHead(302, { Location: "/app/" });
      res.end();
    } else if (req.url === "/app/")
      res.end('<link rel="icon" href="bad"><link rel="icon" href="logo.svg">');
    else if (req.url === "/app/logo.svg")
      res.end(
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="red"/></svg>',
      );
    else {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const png = await fetchSiteIcon(`${origin}/start`);
    const metadata = await sharp(png).metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.width, 32);
    assert.equal(metadata.height, 32);
    assert.equal(await fetchSiteIcon(`${origin}/missing`), null);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
