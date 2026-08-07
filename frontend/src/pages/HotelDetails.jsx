import React from 'react'
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from "react-icons/fa";
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

  const nearByCategories = (hotel.nearBy || []).reduce((groups, place) => {
    const key = place.category || "Nearby";
    if (!groups[key]) groups[key] = [];
    groups[key].push(place);
    return groups;
  }, {});

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
      <div className="hotelDetailImg" style={{ position: "relative" }}>
        <img src={images[currentIndex]} width="100%" alt={hotel.name} />
        <button className="leftBtn" onClick={previousImage}><FaChevronLeft /></button>
        <button className="rightBtn" onClick={nextImage}><FaChevronRight /></button>
      </div>

      <div className="gridHotelImg">
        {images.map((image, i) => (
          <div className="imggrid" key={i} onClick={() => setCurrentIndex(i)}>
            <img src={image} width={"90px"} height={"60px"} alt={`${hotel.name} ${i + 1}`} />
          </div>
        ))}
      </div>

      <div className="hotelDetailLayout">
        <div className="hotelDetailContent">
          <div className="titleRow">
            <div>
              <h1>{hotel.name}</h1>
              <p className="locationLine">
                <FaMapMarkerAlt /> {hotel.city}{hotel.state ? `, ${hotel.state}` : ""}
              </p>
            </div>
            <h3>From Rs {hotel.priceRange.min}/night</h3>
            <span className={`ratingBadge ${rating.cls}`}>{hotel.rating} ⭐ {rating.text}</span>
          </div>

          <div className="quickAmenities">
            {(hotel.amenities || []).slice(0, 5).map((a) => (
              <span className="pill" key={a}>{a}</span>
            ))}
          </div>

          <hr />
          <h2>More Information</h2>
          <p>{hotel.description}</p>
          <hr />

          <div className="amenities">
            <h2>Room types</h2>
            {hotel.rooms.map((room) => (
              <div key={room.type} className="amenity-section">
                <h3>{room.type} — Rs {room.pricePerNight}/night</h3>
                <p style={{ margin: "0 0 4px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                  Sleeps {room.capacity} · {room.availableRooms > 0 ? `${room.availableRooms} rooms left` : "Fully booked"}
                </p>
                <ul>
                  {room.amenities.map((a) => <li key={a}>• {a}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <hr />

          <div className="amenities">
            <h2>All amenities</h2>
            <ul>
              {(hotel.amenities || []).map((a) => <li key={a}>• {a}</li>)}
            </ul>
          </div>

          {hotel.nearBy && hotel.nearBy.length > 0 && (
            <>
              <hr />
              <div className="amenities">
                <h2>What's nearby</h2>
                {Object.entries(nearByCategories).map(([category, places]) => (
                  <div key={category} className="amenity-section">
                    <h3 style={{ textTransform: "capitalize" }}>{category}</h3>
                    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "6px" }}>
                      {places.map((place) => (
                        <div key={place.name} style={{ minWidth: "150px", flexShrink: 0 }}>
                          <img
                            src={place.image}
                            alt={place.name}
                            width="150"
                            height="90"
                            style={{ objectFit: "cover", borderRadius: "8px", display: "block" }}
                          />
                          <p style={{ fontSize: "13px", margin: "6px 0 2px", fontWeight: 500 }}>{place.name}</p>
                          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                            {place.distanceKm} km · {place.rating} ⭐
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <hr />
          <div className="amenities">
            <h2>Policies</h2>
            <ul>
              <li>• Check-in: {hotel.policies.checkInTime}</li>
              <li>• Check-out: {hotel.policies.checkOutTime}</li>
              <li>• {hotel.policies.cancellation}</li>
              <li>• Pets {hotel.policies.petsAllowed ? "allowed" : "not allowed"}</li>
              <li>• Smoking {hotel.policies.smokingAllowed ? "allowed" : "not allowed"}</li>
            </ul>
          </div>

          {hotel.reviews && hotel.reviews.length > 0 && (
            <>
              <hr />
              <div className="amenities">
                <h2>Reviews ({hotel.reviewCount})</h2>
                {hotel.reviews.slice(0, 5).map((rev, i) => (
                  <div key={i} className="amenity-section">
                    <h3>{rev.userName} — {rev.rating} ⭐</h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="bookingSidebar">
          <label className="sidebarLabel">Room type</label>
          <select value={selectedRoomType || ""} onChange={(e) => setSelectedRoomType(e.target.value)}>
            {hotel.rooms.map((room) => (
              <option key={room.type} value={room.type}>
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
              <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
            ))}
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