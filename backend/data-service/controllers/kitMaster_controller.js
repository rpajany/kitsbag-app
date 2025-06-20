import KitMaster from "../models/kitMaster_model.js";
import { logger } from "../utils/logger.js";

// load Master
export const Load_Master = async (req, res, next) => {
  try {
    const kits = await KitMaster.find();

    return res.status(200).json({
      data: kits,
      message: "Successfully Load All KitMaster data.",
      success: false,
      error: true,
    });
  } catch (error) {
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

    // Check if KitMaster already exists
    const existsKit = await KitMaster.findOne({
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
    const newMaster = new KitMaster(master_Data).save();

    res.status(201).json({
      data: newMaster,
      message: "MainKit Inserted Successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error); // pass to centralized error handler
  }
};
