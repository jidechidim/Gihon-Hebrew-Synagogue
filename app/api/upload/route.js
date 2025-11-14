import { IncomingForm } from "formidable";
import { writeFileToPublic } from "@/lib/fsUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const form = new IncomingForm({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        return;
      }

      const file = files.file;
      if (!file) {
        resolve(new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 }));
        return;
      }

      const data = await fs.readFile(file.filepath);
      const fileName = file.originalFilename;

      await writeFileToPublic(fileName, data);

      resolve(
        new Response(JSON.stringify({ url: `/assets/${fileName}` }), { status: 200 })
      );
    });
  });
}
