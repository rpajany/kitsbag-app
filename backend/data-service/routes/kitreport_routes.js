import express from "express";
import {
  Load_KitReport,
  Load_CompleteKit_ByOrderBag,
  KitReport_ByOrderBag,
  Insert_KitReport,
  Update_ByWeightLabel,
} from "../controllers/kitReport_controller.js";
const router = express.Router();

router.post("/load", Load_KitReport);
router.post("/load_completeKit_ByOrderBag", Load_CompleteKit_ByOrderBag);
router.post("/byOrderBagNo", KitReport_ByOrderBag);
router.post("/insert", Insert_KitReport);
router.post("/updateKitReport_ByWeightLabel", Update_ByWeightLabel);

export default router;
