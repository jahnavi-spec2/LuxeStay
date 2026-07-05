import { useEffect, useState } from 'react';
import './App.css'

import { ProductListing , Hero, CategoriesSection} from './Third';

function App() {

const [hotels,setHotels]=useState([]);

    async function fetchHotels() {
    let url = "https://demohotelsapi.pythonanywhere.com/hotels/";
    let res = await fetch(url);
    let data = await res.json();
    setHotels(data.data);
  }

  useEffect(()=>{
fetchHotels();
  },[]);


  const [currentLocation, setCurrentLocation]=useState("All");
  
    const filteredHotels =
    currentLocation === "All"
      ? hotels
      : hotels.filter(hotel => hotel.location === currentLocation);
  
 
  return (


    <>
  
  <Hero hotels={hotels}/>
       <CategoriesSection hotels={hotels} currentLocation={currentLocation}    setCurrentLocation={setCurrentLocation} />
      <ProductListing  filteredHotels={filteredHotels}/>
    </>
  )
}

export default App