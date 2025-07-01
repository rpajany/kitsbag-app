import UID from "../models/uid_model.js";
import Counter from "../models/counter.js";
import { logger } from "../utils/logger.js";

export const Create_SerialUID = async (req, res, next) => {
  try {
    await UID.create({
      _id: "fixed_id_1",
      serial_uid: 1000000,
    });

    res.status(200).json({
      message: "Serial_UID initialized to 99999.",
      success: true,
    });
  } catch (error) {
    console.error("Error Create_SerialUID :", error);

    logger.error("Error Create_SerialUID :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Get_Serial_UID = async (req, res, next) => {
  try {
    console.log("Get_Serial_UID called !");
    const { id } = req.params;
    console.log("Get_Serial_UID called with id:", id);
    const next_uid = await UID.findById(id); // await is required

    if (!next_uid) {
      logger.error("Error next_uid not found :", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      return res.status(404).json({
        message: "UID not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      data: next_uid,
      message: "Get_Serial_UID data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Get_SerialUID :", error);

    logger.error("Error Get_SerialUID :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Update_Serial_UID = async () =>{
  try {
    const { id } = req.params;
     const update_Data = {
          serial_uid: req.body.serial_uid,
          
        };
    
        const updatedData = await Order.findByIdAndUpdate(id, update_Data, {
          new: true,
          runValidators: true,
        });
    
        if (!updatedData) {
          console.log("Order not found ID.");
          return res.status(404).json({
            message: "Order not found.",
            success: false,
            error: true,
          });
        } else {
          //   console.log("Updated Document:", updatedData);
    
          res.status(200).json({
            data: updatedData,
            message: "Update_Serial_UID Successfully.",
            success: true,
            error: false,
          });
        }
  } catch (error) {
     console.error("Error Update_Serial_UID :", error);

    logger.error("Error Update_Serial_UID :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
}

export const Set_CounterUID_Number = async (req, res, next) => {
  try {
    const existing = await Counter.findById("serial_uid");
    if (existing) {
      return res.status(200).json({
        message: "UID counter already initialized.",
        success: true,
      });
    }

    await Counter.create({ _id: "serial_uid", seq: 99999 });

    res.status(200).json({
      message: "UID counter initialized to 99999.",
      success: true,
    });
  } catch (error) {
    console.error("Error Set_UID_Number :", error);

    logger.error("Error Set_UID_Number :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Get_CounterNext_UID = async (req, res, next) => {
  try {
    // Increment the counter and get the new value
    const counter = await Counter.findByIdAndUpdate(
      { _id: "serial_uid" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Create a UID entry (optional, if you want to store it in UID collection)
    const newUID = new UID({ serial_uid: counter.seq });
    await newUID.save();

    logger.info("Get_SerialUID : Successfully fetched data", {
      serial_uid: counter.seq,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      data: counter.seq,
      message: "Get_SerialUID data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Get_SerialUID :", error);

    logger.error("Error Get_SerialUID :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Reset_CounterUID_Number = async (req, res, next) => {
  try {
    // const existing = await Counter.findById("serial_uid");
    // if (existing) {
    //   return res.status(200).json({
    //     message: "UID counter already initialized.",
    //     success: true,
    //   });
    // }

    await Counter.findByIdAndUpdate(
      "serial_uid",
      { $set: { seq: 99999 } },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Reset_UID_Number to 99999.",
      success: true,
    });
  } catch (error) {
    console.error("Error Reset_UID_Number :", error);

    logger.error("Error Reset_UID_Number :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};
