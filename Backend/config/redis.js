import logger from "../utils/logger.js";
import Redis from "ioredis";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({
    path: "./.env",
});

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
    logger.info("Redis connected ✅");
});

redisClient.on("error", (err) => {
    logger.error("Redis error ❌", err);
});

export default redisClient;
