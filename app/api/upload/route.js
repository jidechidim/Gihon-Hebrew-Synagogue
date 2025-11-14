import { promises as fs } from "fs";
import path from "path";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = new IncomingForm({ multiples: false });
  
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) reject(err);

      const file = files.file;
      const data = await fs.readFile(file.filepath);
      const fileName = file.originalFilename;

      const publicDir = path.join(process.cwd(), "public/assets");
      await fs.writeFile(path.join(publicDir, fileName), data);

      resolve(
        new Response(JSON.stringify({ url: `/assets/${fileName}` }), {
          status: 200,
        })
      );
    });
  });
}
