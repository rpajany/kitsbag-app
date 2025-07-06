import Order from "../models/order_model.js";
import { format } from "date-fns";
import { logger } from "../utils/logger.js";

export const Load_Order = async (req, res, next) => {
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

    // const order_data = await Order.find().sort({ _id: -1 }); // Descending;

    // Filter records based on createdAt field
    const order_data = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ _id: -1 });

    logger.info("Load_Order : Successfully fetched order data", {
      count: order_data.length,
      timestamp: new Date().toISOString(),
    });

    const formattedData = order_data.map((row) => {
      const rowObj = row.toObject();
      return {
        ...rowObj,
        order_date: format(row.order_date, "dd-MM-yyyy"),
        delivery_date: format(row.delivery_date, "dd-MM-yyyy"),
      };
    });

    return res.status(200).json({
      data: formattedData,
      message: "Load_Order data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_Order :", error);

    logger.error("Error Load_Order :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Load_OrderNumber = async (req, res, next) => {
  try {
    const unique_OrderNumbers = await Order.distinct("order_number");
    //  const order_data = await Order.find().select('order_number order_date'); // specific fields

    logger.info("Load_OrderNumber : Successfully loaded  OrderNumber's", {
      count: unique_OrderNumbers.length,
      timestamp: new Date().toISOString(),
    });

    const comboData = unique_OrderNumbers.map((item) => ({
      value: item,
      label: item,
    }));

    return res.status(200).json({
      data: comboData,
      message: "Load_OrderNumber's data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_OrderNumber :", error);

    logger.error("Error Load_OrderNumber :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Get_ByOrderNo = async (req, res, next) => {
  try {
    const { order_number } = req.params;

    // if no order_number
    if (!order_number) {
      return res.status(400).json({
        message: "Order number is required",
        success: false,
        error: true,
      });
    }

    const order_data = await Order.find({ order_number }); // .sort({ _id: -1 }); // Descending;

    logger.info("Load_OrderNumber : Successfully  Load_OrderNumber", {
      count: order_data.length,
      order_number,
      timestamp: new Date().toISOString(),
    });

    const formattedData = order_data.map((row) => {
      const rowObj = row.toObject();
      return {
        ...rowObj,
        // order_date: format(row.order_date, "dd-MM-yyyy"),
        // delivery_date: format(row.delivery_date, "dd-MM-yyyy"),
        order_date: row.order_date
          ? format(new Date(row.order_date), "dd-MM-yyyy")
          : null,
        delivery_date: row.delivery_date
          ? format(new Date(row.delivery_date), "dd-MM-yyyy")
          : null,
      };
    });

    return res.status(200).json({
      data: formattedData,
      message: "Load_OrderNumber data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_OrderNumber :", error);

    logger.error("Error Load_OrderNumber :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Update_OrderStart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_qty, status } = req.body;

    console.log(id, start_qty);
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: id }, // _id value (e.g., req.params.id)
      { $set: { start_qty: start_qty, status: status } }, // fields to update ,   { $set: { field1: value1, field2: value2 } },
      { new: true }, // returns the updated document
      { runValidators: true } //  enforce schema validation on update.
    ); // .select('order_number description'); to get data after update

    logger.info("Update_OrderStart : Successfully  Updated !", {
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      // data: formattedData,
      message: "Update_OrderStart data Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Load_OrderNumber :", error);

    logger.error("Error Load_OrderNumber :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

export const Update_ByWeightLabel = async (req, res, next) => {
  try {
    // console.log("req.body :", req.body);
    const { order_updateData } = req.body;
    const { _id, complete_qty, pending_qty, status } = order_updateData;

    if (!_id) {
      return res.status(400).json({
        message: "_id is required for update.",
        success: false,
        error: true,
      });
    }

    const updatedData = await Order.findByIdAndUpdate(
      _id,
      {
        complete_qty,
        pending_qty,
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
        message: `Order not found with this ID`,
        success: false,
        error: true,
      });
    } else {
      //   console.log("Updated Document:", updatedData);

      res.status(200).json({
        data: updatedData,
        message: "UpdateOrder_ByWeightLabel Successfully.",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("Error UpdateOrder_ByWeightLabel :", error);

    logger.error("Error UpdateOrder_ByWeightLabel :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

// insert
export const Insert_Order = async (req, res, next) => {
  try {
    const order_Data = {
      order_number: req.body.order_number,
      // order_date: req.body.order_date,
      order_date: new Date(req.body.order_date),
      bag_number: req.body.bag_number,
      description: req.body.description,
      order_qty: req.body.order_qty,
      start_qty: req.body.start_qty,
      complete_qty: req.body.complete_qty,
      pending_qty: req.body.pending_qty,
      delivery_date: req.body.delivery_date,
      status: req.body.status,
      rate: req.body.rate,
    };

    // save new order
    const newOrder = await new Order(order_Data).save();

    logger.info("Insert_Order : Successful !", {
      timestamp: new Date().toISOString(),
    });

    if (!newOrder) {
      console.log("Error Order Insert..");
      return res.status(404).json({
        message: "Error Order Insert..",
        success: false,
        error: true,
      });
    }

    res.status(201).json({
      data: newOrder,
      message: "Order Inserted Successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error Insert_Order :", error);

    logger.error("Error Insert_Order :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

// Update
export const Update_Order = async (req, res, next) => {
  try {
    const { id } = req.params;

    const update_Data = {
      order_number: req.body.order_number,
      // order_date: req.body.order_date,
      order_date: new Date(req.body.order_date),
      bag_number: req.body.bag_number,
      description: req.body.description,
      order_qty: req.body.order_qty,
      start_qty: req.body.start_qty,
      complete_qty: req.body.complete_qty,
      pending_qty: req.body.pending_qty,
      delivery_date: req.body.delivery_date,
      status: req.body.status,
      rate: req.body.rate,
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
        message: "Order Updated Successfully.",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("Error Update_Order :", error);

    logger.error("Error Update_Order :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};

// Delete
export const Delete_Order = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Order not found, Delete Failed !",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
      success: true,
      error: false,
      data: deleted,
    });
  } catch (error) {
    console.error("Error Delete_Order :", error);

    logger.error("Error Delete_Order :", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    next(error); // pass to centralized error handler
  }
};
