import React from 'react'
import {Hero, ProductListing, CategoriesSection,} from "../Third.jsx";

import { Pagination } from "../Pagination";
function Home({hotels,currentLocation,setCurrentLocation,currentPage,setCurrentPage,totalPages,paginatedHotels}) {
  return (
  <>
  
  <Hero hotels={hotels} />

      <CategoriesSection
        hotels={hotels}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        setCurrentPage={setCurrentPage}
      />

      <ProductListing filteredHotels={paginatedHotels} />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
  
  </>
  )
}

export default Home