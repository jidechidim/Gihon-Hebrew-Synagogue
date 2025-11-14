import { writeFileToPublic } from "@/lib/fsUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    // Example: save homepage data
    const fileName = "home.json";
    await writeFileToPublic(fileName, JSON.stringify(body, null, 2));

    return new Response(JSON.stringify({ message: "Home content saved", url: `/assets/${fileName}` }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
