import React from 'react'
import { Hero, ProductListing, CategoriesSection, SortBar,SearchBar } from "../Third.jsx";
import { useRef } from 'react';
import { Pagination } from "../Pagination";

function Home({
  hotels, hotelsLoading,currentLocation, setCurrentLocation,
  currentPage, setCurrentPage, totalPages, paginatedHotels,
  sortBy, setSortBy,searchTerm, setSearchTerm, resultsCount
}) {

  const hotelSectionRef = useRef(null); 

  const scrollToHotels = () => {
    hotelSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero hotels={hotels} onExplore={scrollToHotels} />


      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />   {/* ← here */}


      <div ref={hotelSectionRef}>
        <CategoriesSection
          hotels={hotels}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          setCurrentPage={setCurrentPage}
        />

        <SortBar sortBy={sortBy} setSortBy={setSortBy} setCurrentPage={setCurrentPage} />
   {!hotelsLoading && (
          <p className="resultsCount">{resultsCount} hotel{resultsCount !== 1 ? "s" : ""} found</p>
        )}

{hotelsLoading ? (
          <div className="hotel-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div className="bookingSkeleton" key={n} style={{ height: 340 }} />
            ))}
          </div>
        ) : paginatedHotels.length === 0 ? (
          <div className="noResults">
            <h3>No hotels match your search</h3>
            <p>Try a different name, location, or clear your filters.</p>
          </div>
        ) : (
        <ProductListing filteredHotels={paginatedHotels} />
        )}

        
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  )
}

export default Home