
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

export function ProductListing({filteredHotels}){
  
    return(
        <>
    <div className="hotel-grid">
       {  filteredHotels.map((el) => (  
            <Hotels 
            key={el.id}
            id={el.id}
            name={el.name} 
            thumbnail={el.thumbnail}
            des={el.description}
            price={el.price}
            rating={el.rating}
            location={el.location}
            photos={el.photos}/>
        ))
    }

    </div>
        
        </>
    )
}



export function Hotels({id,name,thumbnail,des,price,rating,location,photos}){

const navigate = useNavigate();
    let images=[thumbnail,...photos]
    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {

    const interval = setInterval(() => {

        setCurrentIndex((prev) =>
            (prev + 1) % images.length
        );

    }, 4500);
     return () => clearInterval(interval);

}, [images.length]);




    return(
        <>
        <div className="hotel-card">
             <div style={{ position: "relative" }}>
                <img width="100%" height="250px" src={images[currentIndex]} alt={name}/>
               
                   
            
             </div>
             <div className="hotel-content">
   <h1 >{name}</h1>
   <h2>Location: {location}</h2>
   <h3>Price: Rs {price}/day</h3>
    <h3>Rating: {rating} ⭐</h3>
          <p>{des.length>80 ? des.substring(0,80)+ "..." : des}</p>

    <button className="viewDetails" onClick={()=> navigate(`/hotel/${id}`)} > View Details</button>



             </div>

        </div>
        
        
        </>
    )
}



export function Hero({hotels,onExplore}){
   const [index,setIndex]=useState(0);


    const allImages=hotels?.map((h)=>h.thumbnail) || [];



useEffect(()=>{ 

 if (!allImages.length) return;
const interval= setInterval(()=>{
    setIndex((prev)=> (prev+1)% allImages.length);
}, 3000);

return()=> clearInterval(interval);
},[hotels]);
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
      {/* dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
        }}
      ></div>

      {/* content */}
      <div style={{ zIndex: 2, textAlign: "center" }}>
        <h1 className="hero-title" >
          EXPERIENCE LUXURY LIKE NEVER BEFORE 
        </h1>

        <button className="hero-btn"
        onClick={onExplore}
        >
          EXPLORE HOTEL PRUDENCE
        </button>
      </div>
    </div>
  );
}


export function CategoriesSection({hotels,currentLocation,setCurrentLocation,setCurrentPage}){
  const categories=["All",...new Set(hotels.map(hotel=> hotel.location))];

  return(
<>
<div className="categories">
  {categories.map((category)=> (
     <button className="category-btn"  key={category} 
     onClick={() =>  {
     setCurrentLocation(category);
    setCurrentPage(1)}} >{category}</button>
     ))}
</div>
</>

  )
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