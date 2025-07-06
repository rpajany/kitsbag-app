import childMaster from "../models/childMaster_model.js";
import { isValid, parseISO, format } from "date-fns";
import { logger } from "../utils/logger.js";

// load ChildMaster
export const Load_ChildMaster = async (req, res, next) => {
  try {
    let childMaster_Data = [];

    if (req.body && req.body.startDate && req.body.endDate) {
      const { startDate, endDate } = req.body;
      // Filter records based on createdAt field
      childMaster_Data = await childMaster
        .find({
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        })
        .sort({ _id: -1 }); // Descending;
    } else {
      childMaster_Data = await childMaster.find().sort({ _id: -1 }); // Descending;
    }

    return res.status(200).json({
      data: childMaster_Data,
      message: "Load_ChildMaster data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Load_ChildMaster error:", error);
    next(error); // pass to centralized error handler
  }
};

// get  StockReportByID
export const Get_ChildMasterByID = async (req, res, next) => {
  try {
    const {  _id } = req.params;

    // Validate input
    if (!_id) {
      return res.status(400).json({
        message: "Error Get_ChildMasterByID : Missing row id",
        success: false,
        error: true,
      });
    }

    const stockReport_Data = await childMaster.find({ _id }).sort({ _id: -1 }); // Descending;

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
      message: "Get_ChildMasterByID data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Get_ChildMasterByID :", error);
    next(error); // pass to centralized error handler
  }
};

// insert childMaster
export const Insert_ChildMaster = async (req, res, next) => {
  try {
    // const { childMasterData } = req.body;

    const received_childMasterData = {
      part_number: req.body.part_number,
      description: req.body.description,
      part_level: req.body.part_level,
      location: req.body.location,
      bin_number: req.body.bin_number,
      stock_qty: req.body.stock_qty || 0,
    };

    // Check if childMaster already exists
    const existsKit = await childMaster.findOne({
      part_number: received_childMasterData.part_number,
    });

    if (existsKit) {
      logger.info("ChildMaster already exists.");

      return res.status(409).json({
        message: "ChildMaster already exists.",
        success: false,
        error: true,
      });
    }

    // save masterKit
    const new_ChildMaster = await new childMaster(
      received_childMasterData
    ).save();

    res.status(201).json({
      data: new_ChildMaster,
      message: "ChildMaster Inserted Successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Insert_ChildMaster error:", error);
    next(error); // pass to centralized error handler
  }
};

// update
export const Update_ChildMaster = async (req, res, next) => {
  try {
    const { id } = req.params;

    const update_Data = {
      part_number: req.body.part_number,
      description: req.body.description,
      part_level: req.body.part_level,
      location: req.body.location,
      bin_number: req.body.bin_number,
      stock_qty: req.body.stock_qty || 0,
    };

    const updatedData = await childMaster.findByIdAndUpdate(id, update_Data, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      console.log("No document found with this ID.");
      return res.status(404).json({
        message: "childMaster not found.",
        success: false,
        error: true,
      });
    } else {
      //   console.log("Updated Document:", updatedData);

      res.status(200).json({
        data: updatedData,
        message: "childMaster Updated Successfully.",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("Update_ChildMaster error:", error);
    next(error); // pass to centralized error handler
  }
};

// update stock
export const Update_ChildMaster_Stock = async (req, res, next) => {
  try {
    const { id } = req.params;

    const update_Data = {
      stock_qty: req.body.updated_stock,
    };

    const updatedData = await childMaster.findByIdAndUpdate(id, update_Data, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      console.log("No document found with this ID.");
      return res.status(404).json({
        message: "childMaster not found.",
        success: false,
        error: true,
      });
    } else {
      //   console.log("Updated Document:", updatedData);

      res.status(200).json({
        data: updatedData,
        message: "Update_ChildMaster_Stock Updated Successfully.",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("Update_ChildMaster error:", error);
    next(error); // pass to centralized error handler
  }
};

// Delete
export const Delete_ChildMaster = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await childMaster.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "ChildMaster not found, Delete Failed !",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "ChildMaster deleted successfully",
      success: true,
      error: false,
      data: deleted,
    });
  } catch (error) {
    console.error("Delete_ChildMaster error:", error);
    next(error); // pass to centralized error handler
  }
};
