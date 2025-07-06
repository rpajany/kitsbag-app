import StockReport from "../models/stockReport_model.js";
import { isValid, parseISO, format } from "date-fns";
import { logger } from "../utils/logger.js";

// Load StockReport
export const Load_StockReport = async (req, res, next) => {
  try {
    let stockReport_Data = [];

    if (req.body && req.body.startDate && req.body.endDate) {
      const { startDate, endDate } = req.body;
      // Filter records based on createdAt field
      stockReport_Data = await StockReport.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }).sort({ _id: -1 }); // Descending;
    } else {
      stockReport_Data = await StockReport.find().sort({ _id: -1 }); // Descending;
    }

    //format date
    const formattedData = stockReport_Data.map((row) => {
      const rowObj = row.toObject();
      const createdAt = rowObj.createdAt;

      return {
        ...rowObj,
        transact_date:
          createdAt && isValid(new Date(createdAt))
            ? format(new Date(createdAt), "dd-MM-yyyy hh:mm a")
            : "",
      };
    });

    return res.status(200).json({
      data: formattedData,
      message: "Load_KitReport data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Load_KitReport error:", error);
    next(error); // pass to centralized error handler
  }
};

// get  StockReportByID
export const Get_StockReportByID = async (req, res, next) => {
  try {
    const { _id } = req.params;

    // Validate input
    if (!_id) {
      return res.status(400).json({
        message: "Error Get_StockReportByID : Missing row id",
        success: false,
        error: true,
      });
    }

    const stockReport_Data = await StockReport.find(_id).sort({ _id: -1 }); // Descending;

    //format date
    const formattedData = stockReport_Data.map((row) => {
      const rowObj = row.toObject();
      const createdAt = rowObj.createdAt;

      return {
        ...rowObj,
        transact_date:
          createdAt && isValid(new Date(createdAt))
            ? format(new Date(createdAt), "dd-MM-yyyy hh:mm a")
            : "",
      };
    });

    return res.status(200).json({
      data: formattedData,
      message: "Load_KitReport data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Load_KitReport error:", error);
    next(error); // pass to centralized error handler
  }
};

// insert StockReport
export const Insert_StockReport = async (req, res, next) => {
  try {
    // const { childMasterData } = req.body;

    const received_StockReportData = {
      part_id: req.body.part_id,
      part_number: req.body.part_number,
      description: req.body.description,
      location: req.body.location,
      bin_number: req.body.bin_number,
      stock_qty: req.body.stock_qty,
      transact_qty: req.body.transact_qty,
      hand_qty: req.body.hand_qty,
      remarks: req.body.remarks,
      employee: req.body.employee || "",
    };

    // save masterKit
    const new_StockReport = await new StockReport(
      received_StockReportData
    ).save();

    res.status(201).json({
      data: new_StockReport,
      message: "StockReport Inserted Successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Insert_StockReport error:", error);
    next(error); // pass to centralized error handler
  }
};
