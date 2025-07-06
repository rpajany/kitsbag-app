import childKit from "../models/childKit_model.js";
import { logger } from "../utils/logger.js";

// load Master
export const Load_ChildKit = async (req, res, next) => {
  try {
     const {startDate, endDate}= req.body;
     
      // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Missing startDate or endDate",
        success: false,
        error: true,
      });
    }

    // const child_Data = await childKit.find().sort({ _id: -1 }); // Descending;

    // Filter records based on createdAt field
        const child_Data = await childKit.find({
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        }).sort({ _id: -1 });

    return res.status(200).json({
      data: child_Data,
      message: "Load_ChildKit data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Load_ChildKit error:", error);
    next(error); // pass to centralized error handler
  }
};

// load PartKit
export const Get_ByBagNumber = async (req, res, next) => {
  try {
    const { bag_number } = req.params;
    const result = await childKit.find({ bag_number });

    logger.info("Get_ByBagNumber : Successfully fetched ByBagNumber", {
      count: result.length,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      data: result,
      message: "Get_ByBagNumber data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Load_ChildKit error:", error);
    next(error); // pass to centralized error handler
  }
};

// insert Master
export const Insert_ChildKit = async (req, res, next) => {
  try {
    const child_Data = {
      bag_number: req.body.bag_number,
      part_number: req.body.part_number,
      description: req.body.description,
      qty: req.body.qty,
      // min_weight: req.body.min_weight,
      // max_weight: req.body.max_weight,
      part_level: req.body.part_level,
      // parent_item_code: req.body.parent_item_code,
      // sub_assy: req.body.sub_assy,
    };

    // Check if childKit already exists
    // const existsKit = await childKit.findOne({
    //   bag_number: master_Data.bag_number,
    // });
    // if (existsKit) {
    //   logger.info("MainKit already exists.");

    //   return res.status(409).json({
    //     message: "MainKit already exists.",
    //     success: false,
    //     error: true,
    //   });
    // }

    // save masterKit
    const newChild = await new childKit(child_Data).save();

    res.status(201).json({
      data: newChild,
      message: "Child_Kit Inserted Successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Insert_ChildKit error:", error);
    next(error); // pass to centralized error handler
  }
};

// update
export const Update_ChildKit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const update_Data = {
      bag_number: req.body.bag_number,
      part_number: req.body.part_number,
      description: req.body.description,
      qty: req.body.qty,
      // min_weight: req.body.min_weight,
      // max_weight: req.body.max_weight,
      part_level: req.body.part_level,
      // parent_item_code: req.body.parent_item_code,
      // sub_assy: req.body.sub_assy,
    };

    const updatedData = await childKit.findByIdAndUpdate(id, update_Data, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      console.log("No document found with this ID.");
      return res.status(404).json({
        message: "KitMaster not found.",
        success: false,
        error: true,
      });
    } else {
      //   console.log("Updated Document:", updatedData);

      res.status(200).json({
        data: updatedData,
        message: "Child_Kit Updated Successfully.",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("Update_ChildKit error:", error);
    next(error); // pass to centralized error handler
  }
};

// Delete
export const Delete_ChildKit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await childKit.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Child_Kit not found, Delete Failed !",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Child_Kit deleted successfully",
      success: true,
      error: false,
      data: deleted,
    });
  } catch (error) {
    console.error("Delete_ChildKit error:", error);
    next(error); // pass to centralized error handler
  }
};
