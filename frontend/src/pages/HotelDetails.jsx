import React from 'react'
import {
  FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaWifi, FaParking,
  FaSwimmingPool, FaSpa, FaDog, FaUtensils, FaConciergeBell, FaSnowflake,
  FaShuttleVan, FaTshirt, FaClock, FaCheckCircle, FaUsers, FaBed,
  FaCalendarCheck, FaBan, FaSmokingBan, FaThumbsUp, FaCheckDouble, FaStar
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { createBooking, getHotelById } from "../utils/Api";

function ratingLabel(rating) {
  if (rating >= 4.5) return { text: "Excellent", cls: "rating-great" };
  if (rating >= 3.5) return { text: "Very Good", cls: "rating-good" };
  if (rating >= 2.5) return { text: "Average", cls: "rating-avg" };
  return { text: "Below Average", cls: "rating-low" };
}

const AMENITY_ICONS = {
  "free wifi": <FaWifi />,
  "wifi": <FaWifi />,
  "free parking": <FaParking />,
  "parking": <FaParking />,
  "pool": <FaSwimmingPool />,
  "swimming pool": <FaSwimmingPool />,
  "spa": <FaSpa />,
  "pet friendly": <FaDog />,
  "restaurant": <FaUtensils />,
  "room service": <FaConciergeBell />,
  "air conditioning": <FaSnowflake />,
  "airport shuttle": <FaShuttleVan />,
  "laundry service": <FaTshirt />,
  "24-hour front desk": <FaClock />,
};

function getAmenityIcon(name) {
  return AMENITY_ICONS[name?.toLowerCase().trim()] || <FaCheckCircle />;
}

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function HotelDetails() {
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
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const [hotel, setHotel] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setHotel(null);
    setLoadError("");
    setCurrentIndex(0);

    getHotelById(id)
      .then((res) => {
        if (cancelled) return;
        const fetched = res.data.hotel;
        setHotel(fetched);
        if (fetched?.rooms?.length > 0) {
          setSelectedRoomType(fetched.rooms[0].type);
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });

    return () => { cancelled = true; };
  }, [id]);

  if (loadError) {
    return <h2 className="authError">{loadError}</h2>;
  }

  if (!hotel) {
    return <h2>Loading...</h2>;
  }

  const images = [hotel.thumbnail, ...(hotel.photos || [])];
  const selectedRoom = hotel.rooms.find((r) => r.type === selectedRoomType) || hotel.rooms[0];

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const previousImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const rating = ratingLabel(hotel.rating);

  const scrollToSidebar = () => {
    document.querySelector(".bookingSidebar")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSelectRoom = (type) => {
    setSelectedRoomType(type);
    scrollToSidebar();
  };

  const toggleHelpful = (i) => {
    setHelpfulVotes((prev) => ({ ...prev, [i]: !prev[i] }));
  };

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
    if (guests > selectedRoom.capacity) {
      setBookingError(`${selectedRoom.type} sleeps up to ${selectedRoom.capacity} guests.`);
      return;
    }
    if (selectedRoom.availableRooms === 0) {
      setBookingError("This room type is fully booked. Try a different room type.");
      return;
    }
    if (!user) {
      navigate("/login", { state: { from: `/hotel/${id}` } });
      return;
    }

    setBookingLoading(true);
    try {
      await createBooking({
        hotelId: String(hotel._id),
        hotelName: hotel.name,
        hotelLocation: hotel.city,
        hotelThumbnail: hotel.thumbnail,
        roomType: selectedRoom.type,
        pricePerNight: selectedRoom.pricePerNight,
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
    <div className="hotelDetail">

      {/* ---------- GALLERY ---------- */}
      <div className="galleryWrap">
        <div className="hotelDetailImg">
          <img src={images[currentIndex]} alt={hotel.name} />
          <button className="leftBtn" onClick={previousImage} aria-label="Previous photo"><FaChevronLeft /></button>
          <button className="rightBtn" onClick={nextImage} aria-label="Next photo"><FaChevronRight /></button>
          <span className="galleryCounter">{currentIndex + 1} / {images.length}</span>
        </div>

        <div className="gridHotelImg">
          {images.map((image, i) => (
            <div
              className={`imggrid ${i === currentIndex ? "imggridActive" : ""}`}
              key={i}
              onClick={() => setCurrentIndex(i)}
            >
              <img src={image} alt={`${hotel.name} ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="hotelDetailLayout">
        <div className="hotelDetailContent">

          {/* ---------- TITLE / SUMMARY ---------- */}
          <div className="titleRow">
            <div>
              <h1>{hotel.name}</h1>
              <p className="locationLine">
                <FaMapMarkerAlt /> {hotel.city}{hotel.state ? `, ${hotel.state}` : ""}
              </p>
            </div>
            <div className="titleRowRight">
              <span className={`ratingBadge ${rating.cls}`}>{hotel.rating} ⭐ {rating.text}</span>
              <h3>From Rs {hotel.priceRange.min}/night</h3>
            </div>
          </div>

          <div className="quickAmenities">
            {(hotel.amenities || []).slice(0, 5).map((a) => (
              <span className="pill" key={a}>{a}</span>
            ))}
          </div>

          <section className="detailSection">
            <h2 className="sectionTitle">About this stay</h2>
            <p className="sectionBody">{hotel.description}</p>
          </section>

          {/* ---------- ROOM TYPES ---------- */}
          <section className="detailSection">
            <h2 className="sectionTitle">Room types</h2>
            <div className="roomGrid">
              {hotel.rooms.map((room) => {
                const isSelected = room.type === selectedRoomType;
                const soldOut = room.availableRooms === 0;
                return (
                  <div
                    key={room.type}
                    className={`roomCard ${isSelected ? "roomCardSelected" : ""} ${soldOut ? "roomCardSoldOut" : ""}`}
                  >
                    <div className="roomCardHeader">
                      <h3>{room.type}</h3>
                      <p className="roomCardPrice">Rs {room.pricePerNight}<span>/night</span></p>
                    </div>

                    <div className="roomCardMeta">
                      <span><FaUsers /> Sleeps {room.capacity}</span>
                      <span className={soldOut ? "roomMetaSoldOut" : "roomMetaAvailable"}>
                        <FaBed /> {soldOut ? "Fully booked" : `${room.availableRooms} left`}
                      </span>
                    </div>

                    <ul className="roomCardFeatures">
                      {room.amenities.slice(0, 4).map((a) => (
                        <li key={a}>{getAmenityIcon(a)} {a}</li>
                      ))}
                    </ul>

                    <button
                      className="selectRoomBtn"
                      disabled={soldOut}
                      onClick={() => handleSelectRoom(room.type)}
                    >
                      {soldOut ? "Unavailable" : isSelected ? "Selected" : "Select Room"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------- AMENITIES ---------- */}
          <section className="detailSection">
            <h2 className="sectionTitle">All amenities</h2>
            <div className="amenityGrid">
              {(hotel.amenities || []).map((a) => (
                <div className="amenityGridItem" key={a}>
                  <span className="amenityIcon">{getAmenityIcon(a)}</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ---------- BOOKING SIDEBAR (sticky within the two-column area only) ---------- */}
        <aside className="bookingSidebar">
          <label className="sidebarLabel">Room type</label>
          <select value={selectedRoomType || ""} onChange={(e) => setSelectedRoomType(e.target.value)}>
            {hotel.rooms.map((room) => (
              <option key={room.type} value={room.type} style={{ background: '#f8f8f8', color: '#070707' }}>
                {room.type} — Rs {room.pricePerNight}/night
              </option>
            ))}
          </select>

          <p className="sidebarPrice">
            Rs {selectedRoom.pricePerNight} <span>/ night</span>
          </p>

          <label className="sidebarLabel">Check-in</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />

          <label className="sidebarLabel">Check-out</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />

          <label className="sidebarLabel">Guests</label>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {Array.from({ length: selectedRoom.capacity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} style={{ background: '#f8f8f8', color: '#070707' }}>
                {n} guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          {bookingError && <p className="authError">{bookingError}</p>}
          {bookingSuccess && <p className="authSuccess">Booking confirmed!</p>}

          <button className="bookNowBtn" onClick={handleBookNow} disabled={bookingLoading}>
            {bookingLoading ? "Booking..." : "Book now"}
          </button>
        </aside>
      </div>

      {/* ---------- FULL-WIDTH SECTIONS (outside the sidebar grid) ---------- */}

      {/*  NEARBY — single flat slider, no category grouping */}
      {hotel.nearBy && hotel.nearBy.length > 0 && (
        <section className="detailSection">
          <h2 className="sectionTitle">What's nearby</h2>
          <div className="nearbySlider">
            {hotel.nearBy.map((place, i) => (
              <div key={`${place.name}-${i}`} className="nearbyCard">
                <div className="nearbyCardImg">
                  <img src={place.image} alt={place.name} loading="lazy" />
                  {place.category && (
                    <span className="nearbyCategoryTag">{place.category}</span>
                  )}
                </div>
                <div className="nearbyCardBody">
                  <p className="nearbyCardName">{place.name}</p>
                  <p className="nearbyCardMeta">
                    <span>{place.distanceKm} km</span>
                    <span><FaStar className="starIcon" /> {place.rating}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* POLICIES -- */}
      <section className="detailSection">
        <h2 className="sectionTitle">Policies</h2>
        <div className="policyGrid">
          <div className="policyCard">
            <FaClock className="policyCardIcon" />
            <p className="policyCardLabel">Check-in</p>
            <p className="policyCardValue">{hotel.policies.checkInTime}</p>
          </div>
          <div className="policyCard">
            <FaCalendarCheck className="policyCardIcon" />
            <p className="policyCardLabel">Check-out</p>
            <p className="policyCardValue">{hotel.policies.checkOutTime}</p>
          </div>
          <div className="policyCard">
            <FaCheckCircle className="policyCardIcon" />
            <p className="policyCardLabel">Cancellation</p>
            <p className="policyCardValue">{hotel.policies.cancellation}</p>
          </div>
          <div className="policyCard">
            <FaDog className={`policyCardIcon ${hotel.policies.petsAllowed ? "iconYes" : "iconNo"}`} />
            <p className="policyCardLabel">Pets</p>
            <p className={`policyCardValue ${hotel.policies.petsAllowed ? "textYes" : "textNo"}`}>
              {hotel.policies.petsAllowed ? "Allowed" : "Not allowed"}
            </p>
          </div>
          <div className="policyCard">
            <FaSmokingBan className={`policyCardIcon ${hotel.policies.smokingAllowed ? "iconYes" : "iconNo"}`} />
            <p className="policyCardLabel">Smoking</p>
            <p className={`policyCardValue ${hotel.policies.smokingAllowed ? "textYes" : "textNo"}`}>
              {hotel.policies.smokingAllowed ? "Allowed" : "Not allowed"}
            </p>
          </div>
        </div>
      </section>

      {hotel.reviews && hotel.reviews.length > 0 && (
        <section className="detailSection">
          <h2 className="sectionTitle">Reviews ({hotel.reviewCount})</h2>
          <div className="reviewList">
            {hotel.reviews.slice(0, 5).map((rev, i) => (
              <div key={i} className="reviewCard">
                <div className="reviewCardTop">
                  <div className="reviewAvatar">{initials(rev.userName)}</div>
                  <div className="reviewCardMeta">
                    <p className="reviewName">
                      {rev.userName}
                      <span className="verifiedBadge"><FaCheckDouble /> Verified stay</span>
                    </p>
                    <p className="reviewDate">
                      {rev.date ? new Date(rev.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
                    </p>
                  </div>
                  <span className="reviewStars">{rev.rating} <FaStar className="starIcon" /></span>
                </div>
                <p className="reviewComment">{rev.comment}</p>
                <button
                  className={`helpfulBtn ${helpfulVotes[i] ? "helpfulBtnActive" : ""}`}
                  onClick={() => toggleHelpful(i)}
                >
                  <FaThumbsUp /> {helpfulVotes[i] ? "Marked helpful" : "Helpful"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default HotelDetails