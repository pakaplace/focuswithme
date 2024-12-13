import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      maxPoolSize: 10,
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export default { connectDB };
