import mongoose from "mongoose";

const db = async () => {
    try {
        const connection = await mongoose.connect(
          process.env.LOCAL_MONGO_DB_URI
        );
        console.log("Connected to MongoDB");
        return connection;
    } catch (error) {
        throw new error;
    }
}

export default db;