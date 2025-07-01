import express from "express";
import {
  Load_Order,
  Load_OrderNumber,
  Get_ByOrderNo,
  Update_OrderStart,
  Update_ByWeightLabel,
  Insert_Order,
  Update_Order,
  Delete_Order,
} from "../controllers/order_controller.js";
const router = express.Router();

router.post("/load", Load_Order);
router.get("/load_orderNumber", Load_OrderNumber);
router.get("/get_ByOrderNo/:order_number", Get_ByOrderNo);
router.post("/update_orderStart/:id", Update_OrderStart);
router.post("/updateOrder_ByWeightLabel", Update_ByWeightLabel);
router.post("/insert", Insert_Order);
router.put("/update/:id", Update_Order);
router.delete("/delete/:id", Delete_Order);

export default router;
