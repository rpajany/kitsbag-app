import MainKit from "../models/mainKit_model.js";
import { logger } from "../utils/logger.js";

// load Master
export const Load_Master = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    // const kits = await MainKit.find().sort({ _id: -1 }); // Descending;

    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Missing startDate or endDate",
        success: false,
        error: true,
      });
    }

    // Filter records based on createdAt field
    const kits = await MainKit.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ _id: -1 });

    return res.status(200).json({
      data: kits,
      message: "Successfully Load All MainKit data.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Load_Master error:", error);
    next(error); // pass to centralized error handler
  }
};

// Load Distinct master
export const Load_uniqueMainKit = async (req, res, next) => {
  try {
    
    const unique_mainKit = await MainKit.aggregate([
      { $sort: { _id: -1 } }, // Sorts all MainKit documents in descending order of _id
      {
        $group: {
          _id: "$bag_number",
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } } // $replaceRoot replaces the entire document with just the doc field, giving you back the original format of a full MainKit document.
    ]);

    logger.info("Load_uniqueMainKit : Successfully fetched unique MainKit Data", {
      count: unique_mainKit.length,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      data: unique_mainKit,
      message: "Successfully loaded all MainKit data with unique bag_number.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Load_uniqueMainKit error:", error);
    next(error);
  }
};

// Load all BagNumbers
export const Load_BagNumber = async (req, res, next) => {
  try {
    const uniqueBagNumbers = await MainKit.distinct("bag_number");

    logger.info("Load_BagNumber : Successfully fetched MainKit BagNumber's", {
      count: uniqueBagNumbers.length,
      timestamp: new Date().toISOString(),
    });

    const comboData = uniqueBagNumbers.map((item) => ({
      value: item,
      label: item,
    }));

    return res.status(200).json({
      data: comboData,
      message: "Load_BagNumber's data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_BagNumber :", error);

    logger.error("Error Load_BagNumber :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

// insert Master
export const InsertMaster = async (req, res, next) => {
  try {
    const master_Data = {
      bag_number: req.body.bag_number,
      description: req.body.description,
      qty: req.body.qty || 1,
      min_weight: req.body.min_weight,
      max_weight: req.body.max_weight,
      part_level: req.body.part_level,
      parent_item_code: req.body.parent_item_code,
      sub_assy: req.body.sub_assy,
      rate: req.body.rate,
    };

    // Check if MainKit already exists
    const existsKit = await MainKit.findOne({
      bag_number: master_Data.bag_number,
    });
    if (existsKit) {
      logger.info("MainKit already exists.");

      return res.status(409).json({
        message: "MainKit already exists.",
        success: false,
        error: true,
      });
    }

    // save masterKit
    const newMaster = await new MainKit(master_Data).save();

    res.status(201).json({
      data: newMaster,
      message: "MainKit Inserted Successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("InsertMaster error:", error);
    next(error); // pass to centralized error handler
  }
};

// update
export const UpdateMaster = async (req, res, next) => {
  try {
    const { id } = req.params;

    const update_Data = {
      bag_number: req.body.bag_number,
      description: req.body.description,
      qty: req.body.qty,
      min_weight: req.body.min_weight,
      max_weight: req.body.max_weight,
      part_level: req.body.part_level,
      parent_item_code: req.body.parent_item_code,
      sub_assy: req.body.sub_assy,
      rate: req.body.rate,
    };

    const updatedData = await MainKit.findByIdAndUpdate(id, update_Data, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      console.log("No document found with this ID.");
      return res.status(404).json({
        message: "MainKit not found.",
        success: false,
        error: true,
      });
    } else {
      // console.log("Updated Document:", updatedData);

      res.status(200).json({
        data: updatedData,
        message: "MainKit Updated Successfully.",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("Update MainKit error:", error);
    next(error); // pass to centralized error handler
  }
};

// Delete
export const DeleteMaster = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await MainKit.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "MainKit not found, Delete Failed !",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "MainKit deleted successfully",
      success: true,
      error: false,
      data: deleted,
    });
  } catch (error) {
    console.error("Delete MainKit error:", error);
    next(error); // pass to centralized error handler
  }
};
