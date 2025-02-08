import { connectDB } from "./connectDB";
import { RowDataPacket } from "mysql2";

export async function getProjectDisplay(project_num: number = 5) {
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
