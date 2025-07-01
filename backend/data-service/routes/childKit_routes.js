import express from "express";
import {
  Load_ChildKit,
  Get_ByBagNumber,
  Insert_ChildKit,
  Update_ChildKit,
  Delete_ChildKit,
} from "../controllers/childKit_controller.js";
const router = express.Router();

router.post("/load", Load_ChildKit);
router.get("/get_ByBagNumber/:bag_number", Get_ByBagNumber);
router.post("/insert", Insert_ChildKit);
router.put("/update/:id", Update_ChildKit);
router.delete("/delete/:id", Delete_ChildKit);

export default router;
