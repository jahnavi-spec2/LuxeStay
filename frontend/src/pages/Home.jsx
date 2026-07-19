import React from 'react'
import { Hero, ProductListing, CategoriesSection, SortBar } from "../Third.jsx";
import { useRef } from 'react';
import { Pagination } from "../Pagination";

function Home({
  hotels, currentLocation, setCurrentLocation,
  currentPage, setCurrentPage, totalPages, paginatedHotels,
  sortBy, setSortBy
}) {

  const hotelSectionRef = useRef(null);

  const scrollToHotels = () => {
    hotelSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero hotels={hotels} onExplore={scrollToHotels} />

      <div ref={hotelSectionRef}>
        <CategoriesSection
          hotels={hotels}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          setCurrentPage={setCurrentPage}
        />

        <SortBar sortBy={sortBy} setSortBy={setSortBy} setCurrentPage={setCurrentPage} />

        <ProductListing filteredHotels={paginatedHotels} />

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