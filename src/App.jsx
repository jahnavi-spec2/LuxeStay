import { useEffect, useState } from 'react';
import './App.css';
import {Routes,Route} from "react-router-dom"
import { Pagination } from "./Pagination";
import { ProductListing, Hero, CategoriesSection } from './Third';
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
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
    

    <Routes>

      <Route path="/" element={
        <Home
      
            hotels={hotels}
              currentLocation={currentLocation}
              setCurrentLocation={setCurrentLocation}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              paginatedHotels={paginatedHotels}/>}/>

      <Route path="/hotel/:id" element={
      <HotelDetails
      hotels={hotels}/>}/>
    </Routes>
    
    
  );
}

export default App;