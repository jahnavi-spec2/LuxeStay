import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    // 1. Try standard system DNS first (works natively on Render and cloud providers)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // 2. If standard DNS fails due to local ISP SRV blocking (e.g. querySrv ECONNREFUSED on some home routers),
    // try fallback to public Google DNS
    if (
      error.message?.includes("querySrv") ||
      error.message?.includes("ECONNREFUSED") ||
      error.code === "ECONNREFUSED"
    ) {
      console.warn("⚠️ Standard DNS failed. Retrying with fallback DNS (8.8.8.8)...");
      try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 8000,
        });
        console.log(`✅ MongoDB connected via fallback DNS: ${conn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error("❌ MongoDB connection failed with fallback DNS:", fallbackError.message);
        process.exit(1);
      }
    }

    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
