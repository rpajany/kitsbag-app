import mongoose from "mongoose";
import UID from "../models/uid_model.js";
import KitReport from "../models/kirReport_model.js";
import { isValid, parseISO, format } from "date-fns";
import { logger } from "../utils/logger.js";

export const Load_KitReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Missing startDate or endDate",
        success: false,
        error: true,
      });
    }

    // const KitReport_data = await KitReport.find().sort({ _id: -1 }); // Descending;
    // Filter records based on createdAt field
    const KitReport_data = await KitReport.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ _id: -1 });

    logger.info("Load_KitReport : Successfully fetched data", {
      count: KitReport_data.length,
      timestamp: new Date().toISOString(),
    });

    const formattedData = KitReport_data.map((row) => {
      const rowObj = row.toObject();
      const packDate = rowObj.pack_date;

      return {
        ...rowObj,
        pack_date:
          packDate && isValid(new Date(packDate))
            ? format(new Date(packDate), "dd-MM-yyyy")
            : "",
        // delivery_date: same check if needed
      };
    });

    return res.status(200).json({
      data: formattedData,
      message: "Load_KitReport data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_KitReport :", error);

    logger.error("Error Load_KitReport :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Load_CompleteKit_ByOrderBag = async (req, res, next) => {
  try {
    const { order_number, bag_number } = req.body;

    // Input validation
    if (!order_number || !bag_number) {
      return res.status(400).json({
        message: "order_number or bag_number is missing.",
        success: false,
        error: true,
      });
    }

    const KitReport_data = await KitReport.find({
      order_number,
      bag_number,
      status: "Complete", // ✅ Equal to
      // status: { $ne: "Start" }, //  is not equal to
    }).sort({ _id: -1 });

    // if no data found..
    if (KitReport_data.length === 0) {
      return res.status(404).json({
        message:
          "No KitReport found for the given order_number and bag_number.",
        success: false,
        error: false,
        data: [],
      });
    }

    // if data found format date...
    const formattedData = KitReport_data.map((row) => {
      const rowObj = row.toObject();
      return {
        ...rowObj,
        pack_date: row.pack_date
          ? format(new Date(row.pack_date), "dd-MM-yyyy")
          : null,
      };
    });

    return res.status(200).json({
      data: formattedData,
      message: "Load_CompleteKit_ByOrderBag Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_CompleteKit_ByOrderBag :", error);

    logger.error("Error Load_CompleteKit_ByOrderBag :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Load_AllKit_ByOrderBag = async (req, res, next) => {
  try {
    const { order_number, bag_number } = req.body;

    // Input validation
    if (!order_number || !bag_number) {
      return res.status(400).json({
        message: "order_number or bag_number is missing.",
        success: false,
        error: true,
      });
    }

    const KitReport_data = await KitReport.find({
      order_number,
      bag_number,
      // status: "Complete", // ✅ Equal to
      // status: { $ne: "Start" }, //  is not equal to
    }).sort({ _id: -1 });

    // if no data found..
    if (KitReport_data.length === 0) {
      return res.status(404).json({
        message:
          "No KitReport found for the given order_number and bag_number.",
        success: false,
        error: false,
        data: [],
      });
    }

    // if data found format date...
    const formattedData = KitReport_data.map((row) => {
      const rowObj = row.toObject();
      return {
        ...rowObj,
        pack_date: row.pack_date
          ? format(new Date(row.pack_date), "dd-MM-yyyy")
          : null,
      };
    });

    return res.status(200).json({
      data: formattedData,
      message: "Load_AllKit_ByOrderBag Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_AllKit_ByOrderBag :", error);

    logger.error("Error Load_AllKit_ByOrderBag :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Load_CompleteKit_ByDate = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;

    console.log("fromDate, toDate (raw):", fromDate, toDate);

    // Validate input
    if (!fromDate || !toDate) {
      return res.status(400).json({
        message: "Missing date range",
        success: false,
        error: true,
      });
    }

    // Convert JSON strings from frontend  to JavaScript Date objects
    const fromDt = new Date(fromDate);
    const toDt = new Date(toDate);
    console.log("fromDt:", fromDt, "type:", typeof fromDt);
    console.log("toDt:", toDt, "type:", typeof toDt);

    // const KitReport_data = await KitReport.find().sort({ _id: -1 }); // Descending;
    // Filter records based on createdAt field
    const KitReport_data = await KitReport.find({
      // status: "Complete",
      pack_date: {
        $gte: fromDt,
        $lte: toDt,
      },
    });

    console.log("Matched records:", KitReport_data.length);

    logger.info("Load_CompleteKit_ByDate : Successfully fetched data", {
      count: KitReport_data.length,
      timestamp: new Date().toISOString(),
    });

    const formattedData = KitReport_data.map((row) => {
      const rowObj = row.toObject();
      const packDate = rowObj.pack_date;

      return {
        ...rowObj,
        pack_date:
          packDate && isValid(new Date(packDate))
            ? format(new Date(packDate), "dd-MM-yyyy")
            : "",
        // delivery_date: same check if needed
      };
    });

    return res.status(200).json({
      data: formattedData,
      message: "Load_CompleteKit_ByDate data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_CompleteKit_ByDate :", error);

    logger.error("Error Load_CompleteKit_ByDate :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const KitReport_ByOrderBag = async (req, res, next) => {
  try {
    const { order_number, bag_number } = req.body;

    // Input validation
    if (!order_number || !bag_number) {
      return res.status(400).json({
        message: "order_number or bag_number is missing.",
        success: false,
        error: true,
      });
    }

    const KitReport_data = await KitReport.find({
      order_number,
      bag_number,
      status: "Start", // ✅ Equal to
      // status: { $ne: "Start" }, //  is not equal to
    });

    // if no data found..
    if (KitReport_data.length === 0) {
      return res.status(404).json({
        message:
          "No KitReport found for the given order_number and bag_number.",
        success: false,
        error: false,
        data: [],
      });
    }

    // if data found..
    return res.status(200).json({
      data: KitReport_data,
      message: "Load_KitReport ByOrderBagNo Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("KitReport_ByOrderBag error:", error);
    next(error); // pass to centralized error handler
  }
};

export const Insert_KitReport = async (req, res, next) => {
  console.log("Insert_KitReport Called !!");
  // Insert_KitReport with rollback (transaction-safe)
  const session = await mongoose.startSession();

  try {
    const { kitReport_data, qty } = req.body;
    console.log("kitReport_data :", kitReport_data);

    if (!kitReport_data || !qty || qty <= 0) {
      return res.status(400).json({
        message: "Invalid input: kitReport_data and qty are required",
        success: false,
        error: true,
      });
    }

    session.startTransaction();

    // 1. Increment serial_uid safely
    const uidDoc = await UID.findByIdAndUpdate(
      "fixed_id_1",
      { $inc: { serial_uid: qty } }, // $inc is a MongoDB operator that increments the field serial_uid by qty. If current serial_uid is 100 and qty is 3, then it becomes 103.
      { new: true, upsert: true, session } // { new: true } → return the updated document after the increment (not the old one). / { upsert: true } → if no document with _id: "fixed_id_1" exists, create it (initialize it on first use). / { session } → ensures this operation is part of the ongoing MongoDB transaction. It will roll back if anything later fails.
    );

    const endSerial = uidDoc.serial_uid; // get last uid 103
    const startSerial = endSerial - qty + 1; // get first uid 101

    // 2. Prepare qty copies with serial_number
    const kitReports = Array.from({ length: qty }, (_, i) => ({
      ...kitReport_data,
      serial_number: startSerial + i,
       pack_date: kitReport_data.pack_date ? new Date(kitReport_data.pack_date) : null,
    }));

    // 3. Insert all reports inside transaction
    await KitReport.insertMany(kitReports, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      data: kitReports,
      message: `Inserted ${qty} KitReports successfully`,
      success: true,
      error: false,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Insert_KitReport failed, rollback:", error);

    logger.error("Insert_KitReport rollback:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error);
  }
};

export const Update_ByWeightLabel = async (req, res, next) => {
  try {
    // console.log('req.body :',req.body);

    const { kitReport_updateDate } = req.body;
    const { _id, actual_weight, pack_date, shift, employee, status } =
      kitReport_updateDate;

    if (!_id) {
      return res.status(400).json({
        message: "_id is required for update.",
        success: false,
        error: true,
      });
    }

    const updatedData = await KitReport.findByIdAndUpdate(
      _id,
      {
        actual_weight,
        pack_date,
        shift,
        employee,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedData) {
      console.log("No document found with this ID.");
      return res.status(404).json({
        message: "KitReport not found.",
        success: false,
        error: true,
      });
    } else {
      //   console.log("Updated Document:", updatedData);

      res.status(200).json({
        data: updatedData,
        message: "KitReport Update_ByWeightLabel Successfully.",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("KitReport_Update_ByWeightLabel error:", error);
    next(error); // pass to centralized error handler
  }
};
