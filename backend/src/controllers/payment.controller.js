import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/booking.model.js";
import dotenv from "dotenv";
dotenv.config();

const instance=new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

async function createRazorpayOrder(req, res) {
    try{ 
   const {
      hotelId,
      hotelName,
      hotelLocation,
      hotelThumbnail,
      roomType,
      pricePerNight,
      checkIn,
      checkOut,
      guests,
      currency = "INR",
    } = req.body;
          if (!hotelId || !roomType || !pricePerNight || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Booking details are missing",
      });
    }

       const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const totalNights = Math.max(
      1,
      Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    );
    const totalPrice = totalNights * Number(pricePerNight);

        const order = await instance.orders.create({
            amount: Math.round(totalPrice * 100), // ₹ → paise
            currency,
            receipt:  `booking_{hotel_id}_${Date.now()}`
        });

          const booking = await Booking.create({
      user: req.user._id,
      hotelId,
      hotelName,
      hotelLocation,
      hotelThumbnail,
      roomType,
      pricePerNight,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalNights,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
      razorpayOrderId: order.id,
    });

    return res.status(200).json({ success: true, order, bookingId: booking._id });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

           if ( !razorpay_order_id ||  !razorpay_payment_id ||  !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment details are missing"
            });
        }
      


        const signature=crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (signature !== razorpay_signature) { 
            return res.status(400).json({success:false,message:"Payment verification failed"})
        }

        //if they are same if signatiure is valid ...creating booing finding the id back there now ...
         const booking = await Booking.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, user: req.user._id },
      {
        status: "confirmed",
        paymentStatus: "completed",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found for this order" });
    }

           return res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed",
      booking,
    });
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

//a fall back if someone closes app without pAYING MONEY SO STSTUS GET PENDING 

const markPaymentFailed=async(req,res)=>{
try{
  const {razorpay_order_id}=req.body;
  if(!razorpay_order_id)
    return res.status(400).json({
success:false,
message:"razorpay_order_id is required"});
 await Booking.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, user: req.user._id, paymentStatus: "pending" },
      { paymentStatus: "failed" }
    );
 
    return res.status(200).json({ success: true });

}catch(error){
  console.error("Error marking payment failed:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
}
}

export { createRazorpayOrder, verifyRazorpayPayment , markPaymentFailed

};