import { useEffect, useState } from 'react';
import './App.css';
import {Routes,Route} from "react-router-dom"
import { Pagination } from "./Pagination";
import { ProductListing, Hero, CategoriesSection, SortBar } from './Third';
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyBookings from './pages/MyBookings';
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./navBar";
import Footer from  "./footer"
function App() {

  const [hotels, setHotels] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("All");
  const [sortBy, setSortBy] = useState("default");

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

  const filteredHotels =
    currentLocation === "All"
      ? hotels
      : hotels.filter(hotel => hotel.location === currentLocation);

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [currentLocation, sortBy]);

  const totalPages = Math.ceil(sortedHotels.length / hotelsPerPage);

  const startIndex = (currentPage - 1) * hotelsPerPage;
  const endIndex = startIndex + hotelsPerPage;

  const paginatedHotels = sortedHotels.slice(startIndex, endIndex);

  return (
    <AuthProvider>
      <Navbar />

      <Routes>

        <Route path="/" element={
          <Home
            hotels={hotels}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            paginatedHotels={paginatedHotels}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />}/>

        <Route path="/hotel/:id" element={
        <HotelDetails
        hotels={hotels}/>}/>

        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/my-bookings" element={<MyBookings/>} />

      </Routes>
        <Footer />
    </AuthProvider>
  );
}

export default App;