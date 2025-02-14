import fs from "fs";
import Path from "path";
import absPath from "@/app/util/absPath";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
  function validationErr(msg: string) {
    return NextResponse.json({ status: "error", msg: msg }, { status: 400 });
  }

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
    return validationErr("No file uploaded.");
  }

  const fileExt = Path.extname(file.name).toLowerCase().substring(1);
  const targetFilePath = Path.join(targetDir, "tmp." + fileExt);

  // invalid file format
  if (!["sb3", "cc3", "json"].includes(fileExt)) {
    return validationErr(
      "Invalid file format (supported: ['sb3','cc3','json']).",
    );
  }

  // file size limit: 48MB
  if (file.size > 48 * 1024 * 1024) {
    return validationErr("File size limit exceeded (48MB).");
  }

  ////// param validation ///////
  const is_sort = parseInt(formData.get("is_sort") as string);
  if (![0, 1].includes(is_sort)) {
    return validationErr("Invalid is_sort value.");
  }

  const is_high_rank_cate = parseInt(
    formData.get("is_high_rank_cate") as string,
  );
  if (![0, 1].includes(is_high_rank_cate)) {
    return validationErr("Invalid is_high_rank_cate value.");
  }

  ////// validation passed //////

  // save file to target path
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(targetFilePath, buffer);

  // exec python analyze script
  const scriptPath = "./modules";
  const result = execSync(
    `python3 ${scriptPath} ${targetFilePath} ${is_sort} ${is_high_rank_cate}`,
  );
//TODO
  return NextResponse.json({ status: "ok", token });
}
