import express from "express";
import cors from "cors";
import authRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
const app=express();




app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser())



app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",")|| "http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
}))

app.use("/api/usersauth", authRouter);

app.use(errorHandler);


export default app;