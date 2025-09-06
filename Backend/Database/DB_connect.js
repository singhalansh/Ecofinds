import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({
    path: "./.env",
});

const DB_connect = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}`
        );

        if (!connectionInstance) {
            logger.warn("MongoDB connection failed");
        }
        logger.info(
            "MongoDB connected successfully : " +
                connectionInstance.connection.host
        );
    } catch (error) {
        logger.error("MongoDB connection failed due to some error :", error);
    }
};

export default DB_connect;
