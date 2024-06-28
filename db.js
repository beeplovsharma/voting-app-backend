import mongoose from "mongoose";

const db = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    console.log("Error in connecting to DB", error);
  }
};

export default db;
