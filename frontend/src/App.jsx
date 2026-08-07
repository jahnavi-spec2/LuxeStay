import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyBookings from './pages/MyBookings';
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./navBar";
import Footer from "./footer";
import { getHotels } from "./utils/Api";

function App() {
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [hotelsError, setHotelsError] = useState("");

  const [currentCity, setCurrentCity] = useState("All");
  const [currentType, setCurrentType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;

  async function fetchHotels() {
    setHotelsLoading(true);
    setHotelsError("");
    try {
      const res = await getHotels({limit:500}); // hits YOUR backend, not the external demo API
      // Adjust this line if your controller returns a different shape,
      // e.g. res.data (array) vs res.data.hotels
      setHotels(res.data.hotels || res.data || []);
    } catch (err) {
      setHotelsError(err.message);
      setHotels([]);
    } finally {
      setHotelsLoading(false);
    }
  }

  useEffect(() => {
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const matchedCity = currentCity === "All" || hotel.city === currentCity;
    const matchedType = currentType === "All" || (hotel.categories || []).includes(currentType);

    const q = searchTerm.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      hotel.name?.toLowerCase().includes(q) ||
      hotel.city?.toLowerCase().includes(q);

    return matchedCity && matchedType && matchSearch;
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.priceRange.min - b.priceRange.min;
      case "price-high":
        return b.priceRange.min - a.priceRange.min;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [currentCity, currentType, sortBy, searchTerm]);

  const totalPages = Math.ceil(sortedHotels.length / hotelsPerPage);
  const startIndex = (currentPage - 1) * hotelsPerPage;
  const paginatedHotels = sortedHotels.slice(startIndex, startIndex + hotelsPerPage);

  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              hotels={hotels}
              hotelsLoading={hotelsLoading}
              currentCity={currentCity}
              setCurrentCity={setCurrentCity}
              currentType={currentType}
              setCurrentType={setCurrentType}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              paginatedHotels={paginatedHotels}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              resultsCount={sortedHotels.length}
            />
          }
        />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;