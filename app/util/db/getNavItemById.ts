import fs from "fs";
import Path from "path";

export default function getNavItemById(id: number | number[]) {
  const sitesFilePath = Path.join(process.cwd(), "data/nav/sites.json");
  const sites = JSON.parse(fs.readFileSync(sitesFilePath, "utf-8"));
  if (Array.isArray(id)) {
    return id.map((id) => sites[id]);
  } else {
    return sites[id];
  }
}
