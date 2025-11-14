import { promises as fs } from "fs";
import path from "path";
import { IncomingForm } from "formidable";

// Route Segment Config replacement
export const runtime = "nodejs"; // or "edge" if you want edge runtime
export const dynamic = "force-dynamic"; // ensures dynamic behavior, like file uploads

export async function POST(req) {
  // formidable expects the Node.js IncomingMessage object
  const { readable } = req.body ? req : req;

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

      const publicDir = path.join(process.cwd(), "public/assets");
      await fs.mkdir(publicDir, { recursive: true });
      await fs.writeFile(path.join(publicDir, fileName), data);

      resolve(
        new Response(JSON.stringify({ url: `/assets/${fileName}` }), { status: 200 })
      );
    });
  });
}
