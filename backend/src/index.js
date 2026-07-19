

import dotenv from"dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./db/index.js"


import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
const Port = process.env.PORT || 3000;


connectDB()
.then(()=>{
app.listen(Port, ()=>{
    console.log(`Server is running on port http://localhost:${Port}`);
});
})
.catch((err)=>{
    console.error("Error starting server:", err);
     process.exit(1)
});
