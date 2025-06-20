import express from "express";
import {
  Load_Master,
  InsertMaster,
} from "../controllers/kitMaster_controller.js";
const router = express.Router();

router.get("/load", Load_Master);
router.post("/insert", InsertMaster);

export default router;
