import fs from "fs";
import absPath from "./absPath";

export default function readFile(path: string | string[]): string | null {
  const filePath = absPath(path);

  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
