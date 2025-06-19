import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
dotenv.config();

const PORT = process.env.PORT || 8081;
const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Allows all origins
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // is a middleware for Express that parses cookies attached to the client request object. It populates a new object: 'req.cookies' , It reads the cookies from the Cookie header in the incoming HTTP request.It parses them and makes them easily accessible as req.cookies.

// routers
import authRoutes from "./routes/auth_route.js";

// API Routes
app.use("/api/auth", authRoutes);
app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: `Access granted Protected content !`,
    data: req.user,
    success: true,
    error: false,
  });
});

// Global error handler
app.use(errorHandler);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      logger.info("Server started...");
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
