import dotenv from "dotenv";
import axios from "axios";
import dns from "dns";

import connectDB from "../db/index.js";
import Hotel from "../models/hotel.model.js";
import { sleep, withRetry } from "../utils/rateLimiter.js";

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const URL = "https://nominatim.openstreetmap.org/search";
const DELAY = 2500;

async function geocodeHotel(hotel) {
  const response = await axios.get(URL, {
    params: {
      // Search only by city
      q: `${hotel.city}, India`,
      format: "json",
      limit: 1,
      addressdetails: 1,
    },
    headers: {
      "User-Agent": "hotel-project",
    },
  });

  if (response.data.length === 0) {
    return null;
  }

  return mapResult(response.data[0]);
}

function mapResult(result) {
  return {
    lat: Number(result.lat),
    lng: Number(result.lon),
    address: result.display_name,
    state: result.address?.state || "",
    zip: result.address?.postcode || "",
  };
}

async function run() {
  await connectDB();

  const hotels = await Hotel.find({});

  for (const hotel of hotels) {
    try {
      const geo = await withRetry(
        () => geocodeHotel(hotel),
        {
          retries: 5,
          baseDelayMs: 5000,
        }
      );

      if (!geo) {
        console.log(`${hotel.city} not found`);
        await sleep(DELAY);
        continue;
      }

      hotel.address = geo.address;
      hotel.state = geo.state;
      hotel.zip = geo.zip;
      hotel.latitude = geo.lat;
      hotel.longitude = geo.lng;

      hotel.location = {
        type: "Point",
        coordinates: [geo.lng, geo.lat],
      };

      hotel.mapUrl = `https://www.openstreetmap.org/?mlat=${geo.lat}&mlon=${geo.lng}#map=16/${geo.lat}/${geo.lng}`;
      hotel.lastSynced = new Date();

      await hotel.save();

      console.log(`${hotel.name} updated`);
    } catch (err) {
      console.error(`Failed to geocode ${hotel.name}: ${err.message}`);
    }

    await sleep(DELAY);
  }

  console.log("Geocoding completed");
}

run().catch(console.error);