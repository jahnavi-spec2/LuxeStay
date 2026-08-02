import seedrandom from "seedrandom";

import {
  CITIES,
  POPULAR_CITIES,
  AMENITIES_POOL,
  CATEGORY_POOL,
  ROOM_TYPE_TEMPLATES,
  REVIEW_COMMENTS,
  REVIEWER_NAMES,
} from "../data/enrichmentPools.js";
import generateNearby from "./generateNearby.js";

function pick(rand, array) {
  return array[Math.floor(rand() * array.length)];
}

function pickMultiple(rand, array, count) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export default function enrichHotel(rawHotel) {
  const rand = seedrandom(String(rawHotel.id));

  const city = rawHotel.location;
  const knownCity = CITIES.find((c) => c.city.toLowerCase() === city.toLowerCase());

  const rating = rawHotel.rating && Number(rawHotel.rating) > 0 ? Number(rawHotel.rating) : 4;

  const amenities = pickMultiple(rand, AMENITIES_POOL, 5 + Math.floor(rand() * 4));
  const categories = pickMultiple(rand, CATEGORY_POOL, 1 + Math.floor(rand() * 2));

  const reviews = Array.from({ length: 3 + Math.floor(rand() * 8) }, () => ({
    userName: pick(rand, REVIEWER_NAMES),
    rating: Math.max(1, Math.min(5, Math.round(rating + (rand() - 0.5) * 2))),
    comment: pick(rand, REVIEW_COMMENTS),
    date: new Date(Date.now() - Math.floor(rand() * 365 * 24 * 60 * 60 * 1000)),
  }));

  const basePrice = Number(rawHotel.price) || 2000;
  const rooms = ROOM_TYPE_TEMPLATES.map((room) => {
    const totalRooms = 5 + Math.floor(rand() * 15);
    return {
      type: room.type,
      capacity: room.capacity,
      pricePerNight: Math.round(basePrice * room.priceMultiplier),
      totalRooms,
      availableRooms: Math.floor(rand() * (totalRooms + 1)),
      amenities: pickMultiple(rand, AMENITIES_POOL, 3),
    };
  });

  // Nearby attractions — generated from the curated dataset, no API call.
  const nearBy = generateNearby(city, rawHotel.id);

  return {
    externalId: String(rawHotel.id),
    name: rawHotel.name,
    description: rawHotel.description,
    city,
    state: knownCity?.state || "",
    thumbnail: rawHotel.thumbnail,
    photos: rawHotel.photos,
    amenities,
    categories,
    rating: Number(rating),
    starRating: Math.round(rating),
    reviewCount: reviews.length,
    reviews,
    rooms,
    nearBy,
    priceRange: {
      min: Math.min(...rooms.map((r) => r.pricePerNight)),
      max: Math.max(...rooms.map((r) => r.pricePerNight)),
    },
    contact: { phone: "", email: "" },
    policies: {
      checkInTime: "2:00 PM",
      checkOutTime: "11:00 AM",
      cancellation:
        rand() > 0.5
          ? "Free cancellation up to 24 hours before check-in"
          : "Non-refundable booking",
      petsAllowed: rand() > 0.7,
      smokingAllowed: rand() > 0.8,
    },
    tags: POPULAR_CITIES.has(city) ? [...categories, "Popular Destination"] : categories,
    availabilitySummary: rooms.some((r) => r.availableRooms > 0) ? "Rooms available" : "Fully booked",
    source: "college-api",
    raw: rawHotel,
  };
}