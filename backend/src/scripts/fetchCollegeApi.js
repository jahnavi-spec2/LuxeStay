import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const API_URL = process.env.COLLEGE_API_URL;

async function fetchHotels() {
  const response = await axios.get(API_URL);

  // Your API wraps the array inside { data: [...] } — unwrap it.
  const hotels = Array.isArray(response.data) ? response.data : response.data.data;

  if (!Array.isArray(hotels)) {
    throw new Error("Could not find a hotel array in the API response — check its shape.");
  }

  const outputPath = path.join(__dirname, "..", "data", "raw-hotels.json");
  fs.writeFileSync(outputPath, JSON.stringify(hotels, null, 2));

  console.log(`Saved ${hotels.length} hotels to ${outputPath}`);
}

fetchHotels().catch((err) => {
  console.error("Failed to fetch hotels:", err.message);
  process.exit(1);
});

//collge id fetched in data pasrt as rawHotel.js//...