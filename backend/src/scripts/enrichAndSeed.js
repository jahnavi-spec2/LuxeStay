import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "../db/index.js";
import Hotel from "../models/hotel.model.js";
import enrichHotel from "../utils/enrichHotel.js";
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function seed() {
  await connectDB();

  const rawPath = path.join(__dirname, "..", "data", "raw-hotels.json");
  if (!fs.existsSync(rawPath)) {
    throw new Error("src/data/raw-hotels.json not found — run scripts/1_fetchCollegeApi.js first");
  }

  const rawHotels = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
  console.log(`Enriching and seeding ${rawHotels.length} hotels...`);

  let inserted = 0;
  let updated = 0;

  for (const rawHotel of rawHotels) {
    const enriched = enrichHotel(rawHotel);

    const result = await Hotel.findOneAndUpdate(
      { externalId: enriched.externalId },
      { $set: enriched },
      { upsert: true, new: true, rawResult: true }
    );

    if (result.lastErrorObject?.upserted) inserted++;
    else updated++;
  }

  console.log(`✅ Done. Inserted: ${inserted}, Updated: ${updated}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
})