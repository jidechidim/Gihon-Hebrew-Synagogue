import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "../data"); // point to /data folder

export async function readJSON(file) {
  const filePath = path.join(dataDir, file);
  const json = await fs.readFile(filePath, "utf8");
  return JSON.parse(json);
}

export async function writeJSON(file, data) {
  const filePath = path.join(dataDir, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
