import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ✅ service key required to insert
);

async function importData() {
  // Load JSON files
  const events = JSON.parse(fs.readFileSync("./events.json", "utf8"));
  const news = JSON.parse(fs.readFileSync("./news.json", "utf8"));

  console.log("🚀 Importing Events...");
  const { error: eventsErr } = await supabase.from("events").insert(events);
  if (eventsErr) console.error(eventsErr);
  else console.log("✅ Events imported");

  console.log("🚀 Importing News...");
  const { error: newsErr } = await supabase.from("news").insert(news);
  if (newsErr) console.error(newsErr);
  else console.log("✅ News imported");
}

importData();
