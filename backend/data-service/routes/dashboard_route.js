import express from "express";
import {
  Load_Dashboard,
 
 
} from "../controllers/dashboard_controller.js";
const router = express.Router();

router.post("/load", Load_Dashboard);
 
 

export default router;
