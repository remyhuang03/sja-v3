import { connectDB } from "@/app/util/db/connectDB";
import { RowDataPacket } from "mysql2";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const param_n = req.nextUrl.searchParams.get("n");

  const nRegex = /^[1-9][0-9]*$/;

  if (!param_n && !nRegex.test(param_n)) {
    return new Response("400 Bad Request - 0 (param `n` should be 1-100)", {
      status: 400,
    });
  }

  const n: number = param_n ? parseInt(param_n) : 5;

  if (n > 100) {
    return new Response("400 Bad Request - 1 (n too large: should be 1-100)", {
      status: 400,
    });
  }

  try {
    const result = await getProjectDisplay(n);

    if (!result) {
      throw "query error";
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response("fail to do SQL query", {
      status: 500,
    });
  }
}

async function getProjectDisplay(project_num: number = 5) {
  const conn = await connectDB(process.env.DB_SITE_DATABASE);
  try {
    if (!conn) return undefined;

    const [rows] = await conn.execute<RowDataPacket[]>(`
    SELECT * 
    FROM project_display
    ORDER BY RAND() 
    LIMIT ${project_num};`);

    conn.end();
    return rows;
  } catch {
    conn.end();
    return undefined;
  }
}
