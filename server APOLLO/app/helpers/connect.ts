import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connect = async () => {
  const DB_URI = process.env.DB_URI ?? "";

  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Could not connect to db");
    process.exit(1);
  }
};
