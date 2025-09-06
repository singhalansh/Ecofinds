import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import rateLimit from "./middlewares/rateLimiter.js";
import { checkAuthenticated } from "./middlewares/authentication.js";
import cookieParser from "cookie-parser";
import DB_connect from "./Database/DB_connect.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

// Routes
import productRoute from "./routes/product.routes.js";
import userRoute from "./routes/user.routes.js";
import orderRoute from "./routes/order.routes.js";

// Load environment variables
dotenv.config({ path: ".env" });

// Set NODE_ENV for proper logging
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Validate required environment variables
const requiredEnvVars = [
    "MONGODB_URL",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error(
        `❌ Missing required environment variables: ${missingEnvVars.join(
            ", "
        )}`
    );
    console.error("Please check your .env file.");
    process.exit(1);
}

console.log("✅ Environment variables loaded successfully");

// Initialize Express app
const app = express();


// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Common React dev server port
    process.env.FRONTEND_URI, // Your production frontend URL
].filter(Boolean); // Remove any undefined values

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    maxAge: 600, // Cache preflight requests for 10 minutes
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Apply CORS with the configured options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
  
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(rateLimit);

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database connection
logger.info("🔌 Connecting to database...");
DB_connect();

// Health check endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is ready to listen",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// API Routes
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

// Server configuration
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Server started successfully on port ${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    logger.info(` API Base URL: http://localhost:${PORT}/api/v1`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Shutting down gracefully...");
    process.exit(0);
});

process.on("SIGINT", () => {
    logger.info("SIGINT received. Shutting down gracefully...");
    process.exit(0);
});
