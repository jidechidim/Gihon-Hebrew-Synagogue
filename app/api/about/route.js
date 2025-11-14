import { writeFileToPublic } from "@/lib/fsUtils";

// use writeFileToPublic(fileName, data) wherever you write to public/assets


export async function GET() {
  const data = await readJSON("about.json");
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  await writeJSON("about.json", body);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
