import { useEffect, useState } from 'react';
import './App.css';

import { Pagination } from "./Pagination";
import { ProductListing, Hero, CategoriesSection } from './Third';

function App() {

  const [hotels, setHotels] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;

  async function fetchHotels() {
    const url = "https://demohotelsapi.pythonanywhere.com/hotels/";
    const res = await fetch(url);
    const data = await res.json();
    setHotels(data.data);
  }

  useEffect(() => {
    fetchHotels();
  }, []);

  // Location Filter
  const filteredHotels =
    currentLocation === "All"
      ? hotels
      : hotels.filter(hotel => hotel.location === currentLocation);

  // Reset page whenever category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentLocation]);

  // Pagination
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const startIndex = (currentPage - 1) * hotelsPerPage;
  const endIndex = startIndex + hotelsPerPage;

  const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

  return (
    <>
      <Hero hotels={hotels} />

      <CategoriesSection
        hotels={hotels}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
      />

      <ProductListing filteredHotels={paginatedHotels} />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}

export default App;