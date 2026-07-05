
import { useEffect, useState } from 'react'
import { BsJustifyLeft } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function ProductListing({filteredHotels}){
  
    return(
        <>
    <div className="hotel-grid">
       {  filteredHotels.map((el) => (  
            <Hotels 
            key={el.id}
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



export function Hotels({name,thumbnail,des,price,rating,location,photos}){


    const [showDescription, setShowDescription]= useState(false);
    let images=[thumbnail,...photos]
    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {

    const interval = setInterval(() => {

        setCurrentIndex((prev) =>
            (prev + 1) % images.length
        );

    }, 2000);
     return () => clearInterval(interval);

}, [images.length]);

    const nextImage=()=>{

      setCurrentIndex((prev)=>
        (prev+1)% images.length
      );
    };

    const previousImage = () => {

    setCurrentIndex((prev) =>
        prev === 0
            ? images.length - 1
            : prev - 1
    );

};


    return(
        <>
        <div className="hotel-card">
             <div style={{ position: "relative" }}>
                <img width="100%" height="250px" src={images[currentIndex]} alt={name}/>
               
                    <button className="leftBtn" onClick={previousImage}>
                    <FaChevronLeft />
                    </button>
               
                
                    <button className="rightBtn" onClick={nextImage}>
                    <FaChevronRight />
                    </button>
            
             </div>
             <div className="hotel-content">
   <h1 >{name}</h1>
   <h2>Location: {location}</h2>
   <h3>Price: Rs {price}/day</h3>
    <h3>Rating: {rating} ⭐</h3>
    <button className="viewMoreBtn"  onClick={()=> {setShowDescription(!showDescription) }} >{showDescription? "View Less": "View More"}</button>

     {showDescription && <p>{des}</p>}


             </div>

        </div>
        
        
        </>
    )
}



export function Hero({hotels}){
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
        
        >
          EXPLORE HOTEL PRUDENCE
        </button>
      </div>
    </div>
  );
}


export function CategoriesSection({hotels,currentLocation,setCurrentLocation}){
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