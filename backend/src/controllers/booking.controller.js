import Booking from "../models/booking.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";

// Helper: number of nights between two dates (min 1)
function nightsBetween(checkIn, checkOut) {
  const msPerNight = 1000 * 60 * 60 * 24;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.round(diff / msPerNight));
}

// POST /api/bookings   (protected)
export const createBooking = asyncHandler(async (req, res) => {
  const {
    hotelId,
    hotelName,
    hotelLocation,
    hotelThumbnail,
    pricePerNight,
    checkIn,
    checkOut,
    guests,
  } = req.body;

  if (!hotelId || !hotelName || !pricePerNight || !checkIn || !checkOut || !guests) {
    throw new ApiError(400, "Missing required booking details");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate) || isNaN(checkOutDate)) {
    throw new ApiError(400, "Invalid check-in or check-out date");
  }

  if (checkOutDate <= checkInDate) {
    throw new ApiError(400, "Check-out date must be after check-in date");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkInDate < today) {
    throw new ApiError(400, "Check-in date cannot be in the past");
  }

  const totalNights = nightsBetween(checkInDate, checkOutDate);
  const totalPrice = totalNights * Number(pricePerNight);

  const booking = await Booking.create({
    user: req.user._id,
    hotelId,
    hotelName,
    hotelLocation,
    hotelThumbnail,
    pricePerNight,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    totalNights,
    totalPrice,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { booking }, "Booking confirmed"));
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { bookings }, "Bookings fetched"));
});

// GET /api/bookings/:id   (protected) - single booking, must belong to the user
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (String(booking.user) !== String(req.user._id)) {
    throw new ApiError(403, "You don't have access to this booking");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { booking }, "Booking fetched"));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (String(booking.user) !== String(req.user._id)) {
    throw new ApiError(403, "You don't have access to this booking");
  }

  if (booking.status === "cancelled") {
    throw new ApiError(400, "Booking is already cancelled");
  }

  booking.status = "cancelled";
  await booking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { booking }, "Booking cancelled"));
});
