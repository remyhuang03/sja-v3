import Path from "path";

export default function absPath(
  path: string | string[] | undefined | null,
): string {
  const siteRoot = process.cwd();

  if (!path) return siteRoot;

  let paths = [];
  if (!Array.isArray(path)) paths.push(path);
  else paths = path;

  let filePath = siteRoot;
  paths.forEach((p) => {
    filePath = Path.join(filePath, p);
  });

  return filePath;
}
