import mongoose from "mongoose";
import { log } from "./logger";

export const connect = async () => {
  const DB_URI = process.env.DB_URI ?? "";

  try {
    await mongoose.connect(DB_URI);
    log.info("Connected to DB");
  } catch (error) {
    log.error("Could not connect to db");
    process.exit(1);
  }
};
