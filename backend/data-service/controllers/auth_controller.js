import bcrypt from "bcrypt";
import User from "../models/user_model.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// register
export const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // Input validation
    if (!username || !password || !role) {
      logger.info("All fields (username, password, role) are required.");

      return res.status(400).json({
        message: "All fields (username, password, role) are required.",
        success: false,
        error: true,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logger.info("Username already exists.");

      return res.status(409).json({
        message: "Username already exists.",
        success: false,
        error: true,
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    // Optional: Don't expose password hash in response
    const userResponse = {
      _id: user._id,
      username: user.username,
      role: user.role,
    };

    res.status(201).json({
      data: userResponse,
      message: "User Created Successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error); // pass to centralized error handler
  }
};

// login
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      logger.info("UserName is Missing");
      throw new Error("UserName is Missing");
    }

    if (!password) {
      logger.info("Password is Missing");
      throw new Error("Password is Missing");
    }

    // check user exists
    const user = await User.findOne({ username });

    // compare password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // output to client
    res
      .cookie("token", token, {
        httpOnly: true, // → not visible in browser's JS (only visible in DevTools > Application > Cookies)
        secure: process.env.NODE_ENV == "development" ? false : true, // false → will NOT send cookie on HTTPS (which is good for localhost, but in production, set to true)
        sameSite: process.env.NODE_ENV == "development" ? "lax" : "none", // "lax" → good default, but be cautious if you're doing cross-site auth (then use 'none' + secure: true)
        maxAge: 3600000, // 1 hour
      })
      .json({
        message: "Login successfully",
        success: true,
        error: false,
      });
  } catch (error) {
    next(error); // pass to centralized error handler
  }
};

// logout
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", { path: "/" }).status(200).json({
      message: "Logout successful",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error); // pass to centralized error handler
  }
};
