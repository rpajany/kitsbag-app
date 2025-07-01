import express from "express";
import {
  Load_Master,
  Load_uniqueMainKit,
  Load_BagNumber,
  InsertMaster,
  UpdateMaster,
  DeleteMaster
} from "../controllers/mainKit_controller.js";
const router = express.Router();

router.post("/load", Load_Master);
router.get("/load_unique", Load_uniqueMainKit);
router.get("/load_bagNumber", Load_BagNumber);
router.post("/insert", InsertMaster);
router.put ("/update/:id", UpdateMaster);
router.delete ("/delete/:id", DeleteMaster);

export default router;
