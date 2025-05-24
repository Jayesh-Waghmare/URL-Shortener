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

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Optional but helpful for OPTIONS preflight
app.options("*", cors());


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(attachUser)

console.log("Registering short_url routes");
app.use("/api/create", short_url);


app.get("/api/health", (req, res) => {
  try {
    // Check MongoDB connection status
    const isConnected = mongoose.connection.readyState === 1;
    
    res.status(200).json({ 
      status: "ok", 
      message: "API is running",
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
      message: "Health check failed",
      error: error.message 
    });
  }
});

app.use("/api/user",user_routes)
app.use("/api/auth",auth_routes)
app.use("/api/create",short_url)
app.get("/:id",redirectFromShortUrl)

app.use(errorHandler)

if(process.env.NODE_ENV !== "production"){
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    try {
      await connectDB();
      console.log(`Server running on port ${PORT}`);
    } catch (error) {
      console.error('Failed to start server:', error);
    }
  });
} else {
  // In production, connect to DB but don't start a server (Vercel handles this)
  // Don't await here as it might cause issues with Vercel's serverless functions
  connectDB().catch(err => console.error('MongoDB connection error:', err));
}


// Export server for Vercel
export default app;
