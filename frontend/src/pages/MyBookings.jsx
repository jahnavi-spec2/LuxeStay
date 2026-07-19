import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaHotel } from "react-icons/fa";
import { getMyBooking, cancelBooking } from "../utils/Api";

function statusMeta(status) {
  if (status === "cancelled") return { label: "Cancelled", cls: "status-cancelled" };
  return { label: "Confirmed", cls: "status-confirmed" };
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBooking();
      setBookings(res.data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    const confirmed = window.confirm("Cancel this booking? This can't be undone.");
    if (!confirmed) return;

    setCancellingId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="myBookingsPage">
        <h1 className="myBookingsTitle">My Bookings</h1>
        <div className="bookingSkeletonList">
          {[1, 2, 3].map((n) => (
            <div className="bookingSkeleton" key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myBookingsPage">
        <p className="authError">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="myBookingsPage">
        <div className="emptyBookings">
          <FaHotel className="emptyBookingsIcon" />
          <h2>No bookings yet</h2>
          <p>Once you book a stay, it'll show up here.</p>
          <Link to="/" className="hero-btn emptyBookingsBtn">Browse Hotels</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="myBookingsPage">
      <h1 className="myBookingsTitle">My Bookings</h1>

      <div className="bookingList">
        {bookings.map((b) => {
          const status = statusMeta(b.status);
          return (
            <div key={b._id} className="bookingCard">
              <div className="bookingCardImg">
                <img src={b.hotelThumbnail} alt={b.hotelName} />
              </div>

              <div className="bookingCardBody">
                <div className="bookingCardTop">
                  <div>
                    <h3>{b.hotelName}</h3>
                    <p className="bookingLocation">
                      <FaMapMarkerAlt /> {b.hotelLocation}
                    </p>
                  </div>
                  <span className={`bookingStatus ${status.cls}`}>{status.label}</span>
                </div>

                <div className="bookingCardDetails">
                  <span>
                    <FaCalendarAlt />
                    {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                    {" "}({b.totalNights} night{b.totalNights > 1 ? "s" : ""})
                  </span>
                  <span>
                    <FaUserFriends /> {b.guests} guest{b.guests > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="bookingCardFooter">
                  <p className="bookingTotal">Total: <strong>Rs {b.totalPrice}</strong></p>

                  {b.status === "confirmed" && (
                    <button
                      className="bookingCancelBtn"
                      onClick={() => handleCancel(b._id)}
                      disabled={cancellingId === b._id}
                    >
                      {cancellingId === b._id ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyBookings;