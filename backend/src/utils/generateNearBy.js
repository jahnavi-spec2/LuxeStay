

import seedrandom from "seedrandom";
import { CITY_ATTRACTIONS } from "../data/cityAttractions.js";

const MIN_DISTANCE_KM = 0.5;
const MAX_DISTANCE_KM = 8;
const NEARBY_COUNT = 5;

function pickMultiple(rand, array, count) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

/**
 * @param {string} city - must match a key in CITY_ATTRACTIONS (case-insensitive)
 * @param {string|number} hotelId - used as the deterministic seed
 * @returns {Array<{name: string, category: string, image: string, rating: number, distanceKm: number}>}
 */
export default function generateNearby(city, hotelId) {
  const cityKey = Object.keys(CITY_ATTRACTIONS).find(
    (key) => key.toLowerCase() === String(city).toLowerCase()
  );

  if (!cityKey) {
    // No curated data for this city yet — return an empty list rather than
    // throwing, so enrichment doesn't fail for a city not in the dataset.
    return [];
  }

  const attractions = CITY_ATTRACTIONS[cityKey];
  // Seed combines city + hotelId so two hotels in the same city with the
  // same id collision risk (won't happen, ids are unique) still diverge,
  // and re-seeding is fully reproducible.
  const rand = seedrandom(`${cityKey}-${String(hotelId)}`);

  const selected = pickMultiple(rand, attractions, NEARBY_COUNT);

  return selected
    .map((place) => ({
      name: place.name,
      category: place.category,
      image: place.image,
      rating: place.rating,
      distanceKm:
        Math.round(
          (MIN_DISTANCE_KM + rand() * (MAX_DISTANCE_KM - MIN_DISTANCE_KM)) * 10
        ) / 10,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}