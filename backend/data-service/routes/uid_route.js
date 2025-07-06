import express from "express";
import {
  Create_SerialUID,
  Get_Serial_UID,
  Update_Serial_UID,
  // Set_CounterUID_Number,
  // Get_CounterNext_UID,
  // Reset_CounterUID_Number,
} from "../controllers/uid_controller.js";
const router = express.Router();

router.post("/create_serial_uid", Create_SerialUID);
router.get("/get_serial_uid/:id", Get_Serial_UID);
router.post("/update_serial_uid/:id", Update_Serial_UID);
export default router;

// router.post("/set_counter_uid", Set_CounterUID_Number);
// router.post("/get_counter_next_uid", Get_CounterNext_UID);
// router.post("/reset_counter_UID", Reset_CounterUID_Number);


