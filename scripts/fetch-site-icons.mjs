import { readFile, mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { parse } from "parse5";
import sharp from "sharp";

const maxBytes = 2 * 1024 * 1024;
const fallback = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#a1a1aa" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></g></svg>',
);

// Only repository-maintained website URLs are used; this is not a public proxy.
export function iconCandidates(html, pageUrl) {
  const nodes = [];
  function visit(node) {
    if (node.tagName === "link" || node.tagName === "base") nodes.push(node);
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html));
  const attrs = (node) =>
    Object.fromEntries(node.attrs.map(({ name, value }) => [name, value]));
  let base = pageUrl;
  const baseNode = nodes.find(
    (node) => node.tagName === "base" && attrs(node).href,
  );
  if (baseNode) {
    try {
      base = new URL(attrs(baseNode).href, pageUrl).href;
    } catch {
      /* Use the response URL. */
    }
  }
  const icons = [];
  for (const node of nodes.filter((node) => node.tagName === "link")) {
    const { rel = "", href } = attrs(node);
    if (
      !href ||
      !rel
        .toLowerCase()
        .split(/\s+/)
        .some((value) => value === "icon" || value === "apple-touch-icon")
    )
      continue;
    try {
      const url = new URL(href, base);
      if (
        ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password
      )
        icons.push(url.href);
    } catch {
      /* Ignore malformed metadata. */
    }
  }
  return [
    ...new Set([...icons.slice(0, 4), new URL("/favicon.ico", pageUrl).href]),
  ];
}

async function download(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: { "User-Agent": "SJA-IconFetcher/1.0 (+https://sja.remya.top)" },
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`HTTP ${response.status}`);
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("Response exceeds 2 MiB");
    chunks.push(chunk);
  }
  return { bytes: Buffer.concat(chunks), url: response.url };
}

export async function fetchSiteIcon(websiteUrl) {
  const deadline = AbortSignal.timeout(18_000);
  let candidates = [new URL("/favicon.ico", websiteUrl).href];
  try {
    const page = await download(
      websiteUrl,
      AbortSignal.any([deadline, AbortSignal.timeout(6_000)]),
    );
    candidates = iconCandidates(page.bytes.toString("utf8"), page.url);
  } catch {
    /* Sites with inaccessible HTML can still serve a root favicon. */
  }
  for (const url of candidates) {
    try {
      const { bytes } = await download(
        url,
        AbortSignal.any([deadline, AbortSignal.timeout(4_000)]),
      );
      // Rasterization prevents serving third-party scripts or active SVG content.
      return await sharp(bytes, { limitInputPixels: 16_000_000, pages: 1 })
        .resize(32, 32, { fit: "contain", background: "#00000000" })
        .png()
        .toBuffer();
    } catch {
      /* Try the next declared icon or the root favicon. */
    }
  }
  return null;
}

async function main() {
  const sites = JSON.parse(await readFile("data/nav/sites.json", "utf8"));
  await mkdir("public/site-icons", { recursive: true });
  const fallbackPng = await sharp(fallback).png().toBuffer();
  const queue = Object.entries(sites);
  let fetched = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const [id, [, url]] = queue.shift();
        if (!/^\d+$/.test(id)) throw new Error("Invalid resource ID");
        const icon = await fetchSiteIcon(url);
        if (icon) fetched++;
        else console.warn(`Using fallback icon: ${new URL(url).hostname}`);
        await writeFile(`public/site-icons/${id}.png`, icon ?? fallbackPng);
      }
    }),
  );
  console.log(`Fetched ${fetched}/${Object.keys(sites).length} website icons.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await main();
