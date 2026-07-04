
import { useEffect, useState } from 'react'
import { BsJustifyLeft } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function ProductListing({hotels}){

  

    return(
        <>
    <div style={{display:"grid" ,gridTemplateColumns:"repeat(3, 1fr)", gap: "30px", padding:"40px"}}>

       {  hotels.map((el) => (  
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
    const [currentImg, setcurrentImg]=useState(images[0]);
    return(
        <>
        <div style={{ border:"2px solid", borderRadius:"10px", overflow:"hidden", padding:"10px 15px",gap:"20px"}}>
             <div style={{ position: "relative" }}>
                <img width="100%" height="250px" src={thumbnail} alt="img"/>
               
                    <button className="leftBtn">
                    <FaChevronLeft />
                    </button>
               
                
                    <button className="rightBtn">
                    <FaChevronRight />
                    </button>
            
             </div>
             <div style={{display: "grid",gridTemplate:"columns",textAlign:"left",border:"none "}}>
   <h1>{name}</h1>
   <h2>Location: {location}</h2>
   <h2>Price: {price}</h2>
    <h2>Rating: {rating}</h2>
    <button className="viewMoreBtn"  onClick={()=> setShowDescription(!showDescription)} >View More</button>

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
        <h1 style={{ fontSize: "60px", marginBottom: "20px" }}>
          EXPERIENCE LUXURY LIKE NEVER BEFORE
        </h1>

        <button
          style={{
            padding: "12px 25px",
            border: "2px solid gold",
            background: "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          EXPLORE HOTEL PRUDENCE
        </button>
      </div>
    </div>
  );
}