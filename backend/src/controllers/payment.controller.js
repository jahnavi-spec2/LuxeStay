import Razorpay from "razorpay";
import crypto from "crypto";

const instance=new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

async function createRazorpayOrder(req, res) {
    try {
        const { amount, currency="INR", receipt } = req.body;
      if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required"
            });
        }

        const order = await instance.orders.create({
            amount: Math.round(Number(amount) * 100), // ₹ → paise
            currency,
            receipt: receipt || `booking_${Date.now()}`
        });
        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

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

        if (signature === razorpay_signature) {
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        }
        else{
            return res.status(400).json({success:false,message:"Payment verification failed"})
        }
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

export { createRazorpayOrder, verifyRazorpayPayment };