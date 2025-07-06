import express from "express";
import {Load_StockReport,Insert_StockReport,Get_StockReportByID} from '../controllers/stockReport_controller.js';

const router = express.Router();

router.post("/load", Load_StockReport);
router.get("/getByID/:_id", Get_StockReportByID);
router.post("/insert", Insert_StockReport);




export default router;