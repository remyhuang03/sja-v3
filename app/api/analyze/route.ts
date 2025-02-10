import { type NextRequest } from "next/server";

export default async function POST(req: NextRequest) {
    return new Response("Gone", { status: 410 });
}
