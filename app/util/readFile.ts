import fs from "fs";
import Path from "path";

export default function readFile(path: string): string | null {
  const filePath = Path.join(process.cwd(), path);

  if (!fs.existsSync(path)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
