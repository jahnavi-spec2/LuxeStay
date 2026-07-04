import { useEffect, useState } from 'react';
import './App.css'

import { ProductListing , Hero} from './Third';

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
 
  return (


    <>
  
     
  <Hero hotels={hotels}/>
      <ProductListing hotels={hotels}/>
    </>
  )
}

export default App