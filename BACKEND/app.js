import express from "express";
import {nanoid} from "nanoid"
import dotenv from "dotenv"
import mongoose from "mongoose"
import connectDB from "./src/config/monogo.config.js"
import short_url from "./src/routes/short_url.route.js"
import user_routes from "./src/routes/user.routes.js"
import auth_routes from "./src/routes/auth.routes.js"
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors"
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser"

dotenv.config()

const app = express();

// Middleware applied to all environments
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

// Optional but helpful for OPTIONS preflight
app.options("*", cors());

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(attachUser)

// Define environment-specific configurations, routes, and error handling
if(process.env.NODE_ENV !== "production"){
  const PORT = process.env.PORT || 3000;

  // Development specific routes
  console.log("Registering development routes");
  app.use("/api/create", short_url);
  app.use("/api/user",user_routes);
  app.use("/api/auth",auth_routes);
  app.get("/:id",redirectFromShortUrl);

  // Health check endpoint for development
  app.get("/api/health", (req, res) => {
    try {
      const isConnected = mongoose.connection.readyState === 1;
      res.status(200).json({
        status: "ok",
        message: "API is running in development",
        dbConnected: isConnected,
        env: {
          nodeEnv: process.env.NODE_ENV,
          hasMongoUri: !!process.env.MONGO_URI,
          hasJwtSecret: !!process.env.JWT_SECRET,
          hasAppUrl: !!process.env.APP_URL,
          hasFrontendUrl: !!process.env.FRONTEND_URL
        }
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Development health check failed",
        error: error.message
      });
    }
  });

  // Development error handler
  app.use(errorHandler);

  // Start server in development
  app.listen(PORT, async () => {
    try {
      await connectDB(); // Connect DB on server start in development
      console.log(`Server running on port ${PORT}`);
    } catch (error) {
      console.error('Failed to start server:', error);
    }
  });
} else {
  // In production, ensure MongoDB connection is established before handling requests
  let isConnecting = false;
  let connectionPromise = null;

  const ensureConnection = async () => {
    if (mongoose.connection.readyState === 1) return;

    if (isConnecting) {
      return connectionPromise;
    }

    isConnecting = true;
    console.log('Connecting to MongoDB...');
    connectionPromise = connectDB()
      .then(() => {
        console.log('MongoDB connected successfully');
        isConnecting = false;
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        isConnecting = false;
        // Depending on desired behavior, you might rethrow or handle differently
        throw err;
      });

    return connectionPromise;
  };

  // Add middleware to ensure DB connection before handling requests in production
  // This middleware will run for every request in production
  app.use(async (req, res, next) => {
    try {
      await ensureConnection();
      next();
    } catch (error) {
      // Handle database connection errors during a request
      res.status(500).json({
        status: "error",
        message: "Database connection failed during request processing",
        error: error.message
      });
    }
  });

  // Production specific routes applied *after* ensureConnection middleware
  console.log("Registering production routes");
  app.use("/api/create", short_url);
  app.use("/api/user",user_routes);
  app.use("/api/auth",auth_routes);
  app.get("/:id",redirectFromShortUrl);

  // Health check endpoint for production (placed after ensureConnection)
  // This will also benefit from the ensureConnection middleware
    app.get("/api/health", (req, res) => {
      try {
        const isConnected = mongoose.connection.readyState === 1;
        res.status(200).json({
          status: "ok",
          message: "API is running in production",
          dbConnected: isConnected,
          env: {
            nodeEnv: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGO_URI,
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasAppUrl: !!process.env.APP_URL,
            hasFrontendUrl: !!process.env.FRONTEND_URL
          }
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Production health check failed",
          error: error.message
        });
      }
    });

  // Production error handler applied *after* routes
  app.use(errorHandler);
}

// Export server for Vercel (this is outside the if/else block as needed by Vercel)
export default app;