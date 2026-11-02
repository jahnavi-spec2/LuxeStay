import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";
import connectDB from "./db/index.js";

// Custom DNS is only needed for local ISPs that fail MongoDB Atlas SRV lookups;
// in production (e.g. Render cloud containers), overriding system DNS can cause connection timeouts.
if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (err) {
    console.warn("Could not set custom DNS servers:", err.message);
  }
}

const Port = process.env.PORT || 8001;

connectDB()
  .then(() => {
    app.listen(Port, "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${Port}`);
    });
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
