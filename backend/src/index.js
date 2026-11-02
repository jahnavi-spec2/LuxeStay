import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";
import connectDB from "./db/index.js";

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
