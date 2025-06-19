import express from "express";
import User from "../models/auth_model.js";
import { register, login } from "../controllers/auth_controller.js";
import { verifyToken, roleAuthorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected example route
router.get("/admin-only", verifyToken, roleAuthorize("admin"), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

export default router;
