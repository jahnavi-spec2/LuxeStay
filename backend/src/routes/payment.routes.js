import expresee from "express";
import {createRazorpayOrder,verifyRazorpayPayment} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

export default router;