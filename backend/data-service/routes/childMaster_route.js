import express from "express";
import {
  Load_ChildMaster,
  Get_ChildMasterByID,
  Insert_ChildMaster,
  Update_ChildMaster,
  Update_ChildMaster_Stock,
  Delete_ChildMaster,
} from "../controllers/childMaster_controller.js";
const router = express.Router();

router.post("/load", Load_ChildMaster);
router.get("/getByID/:_id", Get_ChildMasterByID);
router.post("/insert", Insert_ChildMaster);
router.put("/update/:id", Update_ChildMaster);
router.put("/update_stock/:id", Update_ChildMaster_Stock);
router.delete("/delete/:id", Delete_ChildMaster);

export default router;
