import express from "express";
import {createRazorpayOrder,verifyRazorpayPayment, markPaymentFailed} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();


router.use(verifyJWT)
router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);
router.post("/mark-failed", markPaymentFailed);

export default router;