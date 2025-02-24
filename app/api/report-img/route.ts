import { type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const stamp = req.nextUrl.searchParams.get("stamp");
  const stampRegex = /^[0-9]+_[0-9]+\.svg$/;

  if (!stampRegex.test(stamp) || !stamp) {
    return new Response("400 Bad Request - 0", { status: 400 });
  }

  // check if local file exists
  const localReportPath = path.join(
    process.cwd(),
    "data/var/reports/analyze",
    stamp,
  );

  if (fs.existsSync(localReportPath)) {
    const svgContent = fs.readFileSync(localReportPath,"utf8");

    return new Response(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml"
      },
    });
  } else {
    return new Response("400 Bad Request - 1" + localReportPath, {
      status: 400,
    });
  }
}
