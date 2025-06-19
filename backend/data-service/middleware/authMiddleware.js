import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export const verifyToken = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies?.token;
  // Consider also accepting Bearer headers:
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // console.log("token :", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // req.id = decoded.id;
    // console.log("user :", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Protected example route
export const roleAuthorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Not Authorized, Access denied.",
      });
    }

    next();
  };
