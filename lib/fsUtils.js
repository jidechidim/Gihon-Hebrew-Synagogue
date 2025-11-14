// lib/fsUtils.js
import { promises as fs } from "fs";
import path from "path";

/**
 * Write a file to the public/assets folder
 */
export async function writeFileToPublic(fileName, data) {
  const publicDir = path.join(process.cwd(), "public/assets");
  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, fileName), data);
}
