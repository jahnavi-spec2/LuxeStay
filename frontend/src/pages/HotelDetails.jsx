import React from 'react'
import { FaChevronLeft, FaChevronRight, FaWifi, FaSnowflake, FaParking, FaMapMarkerAlt } from "react-icons/fa";
import {useParams,useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { createBooking } from "../utils/api";

const amenities = {
  "Popular with Guests": [
    "Housekeeping",
    "In-room Dining",
    "Iron/Ironing Board",
    "Wi-Fi",
    "Room Service",
    "Bathroom",
    "Air Conditioning",
    "Mineral Water"
  ],

  "Room Features": [
    "Charging Points",
    "Closet",
    "Seating Area",
    "Mini Fridge",
    "Work Desk",
    "Blackout Curtains",
    "Telephone"
  ],

  "Basic Facilities": [
    "Kettle"
  ],

  "Childcare": [
    "Child safety socket covers"
  ],

  "Safety and Security": [
    "Electronic Safe"
  ],

  "Media and Entertainment": [
    "TV"
  ],

  "Kitchen and Appliances": [
    "Refrigerator"
  ],

  "Bathroom": [
    "Shaving Mirror",
    "Hairdryer",
    "Dental Kit",
    "Toiletries",
    "Western Toilet Seat",
    "Shower Cubicle",
    "Hot & Cold Water"
  ],

  "Other Facilities": [
    "Fan"
  ]
};

function ratingLabel(rating) {
  if (rating >= 4.5) return { text: "Excellent", cls: "rating-great" };
  if (rating >= 3.5) return { text: "Very Good", cls: "rating-good" };
  if (rating >= 2.5) return { text: "Average", cls: "rating-avg" };
  return { text: "Below Average", cls: "rating-low" };
}



function HotelDetails({hotels}) {
const { id } = useParams();
const navigate = useNavigate();
const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
   const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const hotel = hotels.find((h) => String(h.id) === id);
    const [showAllAmenities,setShowAllAmenities]=useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setShowAllAmenities(false);
  }, [id]);

  if (!hotel) {
  return <h2>Loading...</h2>;
}
    const images=[hotel.thumbnail,...hotel.photos]

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

   const amenityEntries = Object.entries(amenities);
  const visibleEntries = showAllAmenities ? amenityEntries : amenityEntries.slice(0, 2);

  const rating = ratingLabel(hotel.rating);

  
  const handleBookNow = async () => {
    setBookingError("");
    setBookingSuccess(false);

    if (checkIn === "" || checkOut === "") {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setBookingError("Check-out date can't be before check-in");
      return;
    }

    if (!user) {
      navigate("/login", { state: { from: `/hotel/${id}` } });
      return;
    }

    setBookingLoading(true);
    try {
      await createBooking({
        hotelId: String(hotel.id),
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        hotelThumbnail: hotel.thumbnail,
        pricePerNight: hotel.price,
        checkIn,
        checkOut,
        guests,
      });
      setBookingSuccess(true);
       setTimeout(() => {
      navigate("/my-bookings");
    }, 900);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };


  return (
    <div  className="hotelDetail">
<div className="hotelDetailImg" style={{position: "relative"}}>
<img src={images[currentIndex]} width="100%" alt={hotel.name}/>

 <button className="leftBtn" onClick={previousImage}>
                    <FaChevronLeft />
                    </button>
               
                
                    <button className="rightBtn" onClick={nextImage}>
                    <FaChevronRight />
                    </button>

</div>

<div className="gridHotelImg">
 {images.map((image, i)=>(
     <div className="imggrid" key={i} onClick={() => setCurrentIndex(i)}>
<img src={image} width={"90px"} height={"60px"} alt={`${hotel.name} ${i + 1}`}/>

    </div>
 ))
}
  
</div>

      <div className="hotelDetailLayout">

      <div className="hotelDetailContent">
        <div className="titleRow">
          <div>
        <h1>{hotel.name}</h1>
        <p className="locationLine">
                <FaMapMarkerAlt /> {hotel.location}
              </p>  
              </div>

              <h3>Price: Rs {hotel.price}/day</h3>
        <span className={`ratingBadge ${rating.cls}`}>{hotel.rating} ⭐ {rating.text}</span>
        </div>
        <div className="quickAmenities">
          <span className="pill">
            <FaWifi /> Free Wi-Fi
          </span>
          <span className="pill">
            <FaParking /> Parking
          </span>

          <span className="pill">
            <FaSnowflake /> Air Conditioning
          </span>

        </div>
<hr/>
<h2> More Information</h2>
        <p>{hotel.description}</p>
<hr/>
<div className="amenities">
        <h2>Amenities</h2>
        {visibleEntries.map(([category,items])=>(
          <div key={category} className="amenity-section">

      <h3>{category}</h3>

      <ul>

        {items.map((item) => (

          <li key={item}>
            • {item}
          </li>
         
        ))}
         </ul>
        </div>
        ))}

        <button className="toggleAmenities" onClick={()=> setShowAllAmenities((p)=> !p)}>
          {showAllAmenities?"Show less":"Show all categories"}
        </button>

    </div>


    <hr/>
    
     </div>


      {/* side bar booking system */}
      <aside className="bookingSidebar">
 <p className="sidebarPrice">
            Rs {hotel.price} <span>/ night</span>
          </p>
 
          <label className="sidebarLabel">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
 
          <label className="sidebarLabel">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />


          <label className="sidebarLabel">Guests</label>
<select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
  <option value="1">1 guest</option>
  <option value="2">2 guests</option>
  <option value="3">3 guests</option>
  <option value="4">4 guests</option>
  <option value="5">5 guests</option>
  <option value="6">6 guests</option>
</select>

{bookingError && <p className="authError">{bookingError}</p>}
{bookingSuccess && <p className="authSuccess">Booking confirmed!</p>}

<button className="bookNowBtn" onClick={handleBookNow} disabled={bookingLoading}>
  {bookingLoading ? "Booking..." : "Book now"}
</button>
      </aside>

      </div>

        </div>
  )
}

export default HotelDetails