import { readJSON, writeJSON } from "@/lib/fsUtils";

export async function GET() {
  const data = await readJSON("leadership.json");
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  await writeJSON("leadership.json", body);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
