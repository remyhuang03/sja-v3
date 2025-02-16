import fs from "fs";
import Path from "path";
import absPath from "@/app/util/absPath";
import { NextRequest } from "next/server";
import { execSync } from "child_process";

function errJson(msg: string, status: number = 400) {
  return new Response(JSON.stringify({ status: "error", msg: msg }), {
    status: status,
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // check root upload dir
    const uploadDir = absPath("data/var/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { mode: 0o755 });
    }

    // create sub upload dir for this task
    const token =
      new Date().getTime().toString() +
      Math.floor(Math.random() * 10000).toString();
    const targetDir = Path.join(uploadDir, "/analyze_" + token);
    fs.mkdirSync(targetDir, { mode: 0o755 });

    ////// file validation //////
    const file = formData.get("file") as File;

    if (!file) {
      return errJson("No file uploaded.");
    }

    const fileExt = Path.extname(file.name).toLowerCase().substring(1);
    const targetFilePath = Path.join(targetDir, "tmp." + fileExt);

    // invalid file format
    if (!["sb3", "cc3", "json"].includes(fileExt)) {
      return errJson("Invalid file format (supported: ['sb3','cc3','json']).");
    }

    // file size limit: 48MB
    if (file.size > 48 * 1024 * 1024) {
      return errJson("File size limit exceeded (48MB).");
    }

    ////// param validation ///////
    const is_sort = parseInt(formData.get("is_sort") as string);
    if (![0, 1].includes(is_sort)) {
      return errJson("Invalid is_sort value.");
    }

    const is_high_rank_cate = parseInt(
      formData.get("is_high_rank_cate") as string,
    );
    if (![0, 1].includes(is_high_rank_cate)) {
      return errJson("Invalid is_high_rank_cate value.");
    }

    ////// validation passed //////

    // save file to target path
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(targetFilePath, buffer);

    // exec python analyze script
    const scriptPath = absPath("/app/api/v2/analyze/analyze.py");
    const dest_dir = absPath(`/data/var/reports`);

    console.log("done1");

    const result = execSync(
      `python3 ${scriptPath} ${targetFilePath} ${is_sort} ${is_high_rank_cate} ${dest_dir}`,
    ).toString();

    console.log("done2");
    console.log("result");

    if (result.startsWith("ok")) {
      return new Response(
        JSON.stringify({ status: "ok", token: result.slice(4) }),
      );
    } else {
      return errJson(result, 500);
    }
  } catch (e) {
    return errJson(e.message, 500);
  }
}
