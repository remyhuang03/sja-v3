import mysql, { ConnectionOptions } from "mysql2/promise";

export async function connectDB(database: string) {
  const access: ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database,
  };
  try {
    const conn = await mysql.createConnection(access);
    return conn;
  } catch {
    return undefined;
  }
}
