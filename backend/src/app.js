import express from "express";
import cors from "cors";
import authRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import bookingRouter from "./routes/booking.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();




app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser())



app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",")|| "http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE","PATCH"],
    allowedHeaders:["Content-Type","Authorization"],
}))

app.use("/api/usersauth", authRouter);
app.use("/api/bookings", bookingRouter);

app.get("/*splat", (req, res, next) => {
    if (req.path.startsWith("/api")) {
        return next();
    }
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(errorHandler);


export default app;