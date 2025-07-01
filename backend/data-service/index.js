import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import trimRequest from "./utils/trimRequest.js"; // Adjust path as needed
dotenv.config();

const PORT = process.env.PORT || 8081;
const app = express();

// Middleware
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       callback(null, true); // Allows all origins
//     },
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:5173/",
  "http://localhost:3000",
  "https://kitsbag-app.onrender.com",
  process.env.FRONTEND_URI,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // is a middleware for Express that parses cookies attached to the client request object. It populates a new object: 'req.cookies' , It reads the cookies from the Cookie header in the incoming HTTP request.It parses them and makes them easily accessible as req.cookies.
app.use(express.urlencoded({ extended: true })); // new added
app.use(trimRequest);  // new added

// routers
import auth_Routes from "./routes/auth_route.js";
import mainkit_Routes from "./routes/mainKit_route.js";
import childKit_Routes from "./routes/childKit_routes.js";
import order_Routes from "./routes/order_routes.js";
import uid_Routes from "./routes/uid_routes.js";
import kitReport_Routes from "./routes/kitreport_routes.js";

// API Routes
app.use("/api/auth", auth_Routes);
app.use("/api/main_kit", mainkit_Routes);
app.use("/api/child_kit", childKit_Routes);
app.use("/api/order", order_Routes);
app.use("/api/uid", uid_Routes);
app.use("/api/kit_report", kitReport_Routes);

app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: `Access granted Protected content !`,
    data: req.user,
    success: true,
    error: false,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.originalUrl });
});

// Global error handler
app.use(errorHandler);

// MongoDB Connection
mongoose
  // .connect(process.env.MONGO_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      logger.info("Server started...");
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
