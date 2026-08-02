

import { CITY_ATTRACTIONS } from "../src/data/cityAttractions.js";

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

async function run() {
  const broken = [];
  for (const [city, attractions] of Object.entries(CITY_ATTRACTIONS)) {
    for (const place of attractions) {
      const ok = await checkUrl(place.image);
      console.log(`${ok ? "✅" : "❌"} ${city} — ${place.name}`);
      if (!ok) broken.push(`${city} — ${place.name}: ${place.image}`);
    }
  }
  console.log("\n--- Summary ---");
  if (broken.length === 0) {
    console.log("All image URLs resolved successfully.");
  } else {
    console.log(`${broken.length} broken URL(s):`);
    broken.forEach((b) => console.log(" - " + b));
  }
}

run();