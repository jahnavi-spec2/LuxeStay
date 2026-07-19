import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All booking routes require the user to be logged in
router.use(verifyJWT);

router.post("/", createBooking);
router.get("/me", getMyBookings);
router.get("/:id", getBookingById);
router.patch("/:id/cancel", cancelBooking);

export default router;
