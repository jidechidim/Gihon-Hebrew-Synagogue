import { writeFileToPublic } from "@/lib/fsUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    // Example: save leadership team data
    const fileName = "leadership.json";
    await writeFileToPublic(fileName, JSON.stringify(body, null, 2));

    return new Response(JSON.stringify({ message: "Leadership saved", url: `/assets/${fileName}` }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
