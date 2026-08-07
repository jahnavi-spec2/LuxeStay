import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const TRENDING_DESTINATIONS = [
  { city: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400" },
  { city: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400" },
  { city: "Udaipur", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400" },
  { city: "Manali", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400" },
  { city: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400" },
  { city: "Hyderabad", image: "https://images.unsplash.com/photo-1571900891531-1e0d0d5b7b8d?w=400" },
];

export function ProductListing({ filteredHotels }) {
  return (
    <div className="hotel-grid">
      {filteredHotels.map((el) => (
        <Hotels
          key={el._id}
          id={el._id}
          name={el.name}
          thumbnail={el.thumbnail}
          des={el.description}
          priceRange={el.priceRange}
          rating={el.rating}
          city={el.city}
          nearBy={el.nearBy}
          photos={el.photos}
        />
      ))}
    </div>
  );
}

export function Hotels({ id, name, thumbnail, des, priceRange, rating, city, nearBy, photos }) {
  const navigate = useNavigate();
  const images = [thumbnail, ...(photos || [])];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images.length]);

  const nearest = nearBy && nearBy.length > 0 ? nearBy[0] : null;

  return (
    <div className="hotel-card">
      <div style={{ position: "relative" }}>
        <img width="100%" height="250px" src={images[currentIndex]} alt={name} />
      </div>
      <div className="hotel-content">
        <h1>{name}</h1>
        <h2><FaMapMarkerAlt style={{ fontSize: "13px" }} /> {city}</h2>
        <h3>Rating: {rating} ⭐</h3>
        <h3 style={{ color: "gold" }}>
          Rs {priceRange?.min}–{priceRange?.max}/night
        </h3>
        {nearest && (
          <p style={{ fontSize: "12px", color: "#3dbaeb", margin: "2px 0" }}>
            {nearest.distanceKm} km from {nearest.name}
          </p>
        )}
        <p>{des && des.length > 80 ? des.substring(0, 80) + "..." : des}</p>

        <button className="viewDetails" onClick={() => navigate(`/hotel/${id}`)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export function Hero({ hotels, onExplore }) {
  const [index, setIndex] = useState(0);
  const allImages = hotels?.map((h) => h.thumbnail) || [];

  useEffect(() => {
    if (!allImages.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hotels]);

  if (!allImages.length) return null;

  return (
    <div
      style={{
        height: "90vh",
        width: "100%",
        backgroundImage: `url(${allImages[index]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "all 1s ease-in-out",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}></div>
      <div style={{ zIndex: 2, textAlign: "center" }}>
        <h1 className="hero-title">EXPERIENCE LUXURY LIKE NEVER BEFORE</h1>
        <button className="hero-btn" onClick={onExplore}>
          EXPLORE LUXESTAY
        </button>
      </div>
    </div>
  );
}

export function TrendingDestinations({ setCurrentCity, setCurrentPage }) {
  return (
    <div style={{ padding: "20px 40px 0" }}>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
        Trending destinations
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
        {TRENDING_DESTINATIONS.map((d) => (
          <div
            key={d.city}
            onClick={() => {
              setCurrentCity(d.city);
              setCurrentPage(1);
            }}
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              height: "80px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.55)), url(${d.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
              padding: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              color: "#fff",
            }}
          >
            {d.city}
          </div>
        ))}
      </div>
    </div>
  );
}

// Mirrors backend src/data/enrichmentPools.js CITIES — keep in sync if you
// add or remove cities there.
export const ALL_CITIES = [
  "Delhi", "Mumbai", "Jaipur", "Goa", "Bengaluru", "Udaipur", "Manali",
  "Kolkata", "Varanasi", "Kochi", "Ahmedabad", "Hyderabad", "Pune", "Noida",
  "Gurgaon", "Chennai",
];

// Mirrors backend CATEGORY_POOL.
export const ALL_CATEGORIES = [
  "Business", "Family Friendly", "Budget", "Luxury", "Boutique", "Resort",
];

export function CategoriesSection({ currentCity, setCurrentCity, setCurrentPage }) {
  const cities = ["All", ...ALL_CITIES];

  return (
    <div className="categories">
      {cities.map((city) => (
        <button
          className="category-btn"
          key={city}
          style={currentCity === city ? { background: "gold", color: "#1a1a1a" } : undefined}
          onClick={() => {
            setCurrentCity(city);
            setCurrentPage(1);
          }}
        >
          {city}
        </button>
      ))}
    </div>
  );
}

export function TypeCategoriesSection({ currentType, setCurrentType, setCurrentPage }) {
  const types = ["All", ...ALL_CATEGORIES];

  return (
    <div className="categories" style={{ marginTop: "-14px" }}>
      {types.map((type) => (
        <button
          className="category-btn"
          key={type}
          style={currentType === type ? { background: "gold", color: "#1a1a1a" } : undefined}
          onClick={() => {
            setCurrentType(type);
            setCurrentPage(1);
          }}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export function SortBar({ sortBy, setSortBy, setCurrentPage }) {
  const options = [
    { value: "default", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Rating: High to Low" },
  ];

  return (
    <div className="sortBar">
      <span className="sortLabel">Sort by</span>
      <select
        className="sortSelect"
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          setCurrentPage(1);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SearchBar({ searchTerm, setSearchTerm, setCurrentPage }) {
  return (
    <div className="heroSectionWrap">
      <div className="heroSearch">
        <FaSearch className="heroSearchIcon" />
        <input
          type="text"
          placeholder="Search hotels..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {searchTerm && (
          <button className="heroSearchClear" onClick={() => setSearchTerm("")} aria-label="Clear search">
            x
          </button>
        )}
      </div>
    </div>
  );
}