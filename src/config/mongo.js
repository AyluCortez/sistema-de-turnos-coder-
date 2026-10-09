import mongoose from "mongoose";
import { env } from "./env.config.js";

export const connectMongo = async (url = env.MONGO_URI, dbName = env.MONGO_DB_NAME) => {
  if (!url) {
    throw new Error("Falta MONGO_URI. Completá .env a partir de .env.example (Atlas).");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(url, { dbName });
  return mongoose.connection;
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();
};
