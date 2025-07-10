import Order from "../models/order_model.js";
import { isValid, parseISO } from "date-fns";
import { logger } from "../utils/logger.js";

export const Load_Dashboard = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body || {};

    const matchConditions = {
      status: { $in: ["Complete", "Started","Scanning"] },
    };

    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);

      if (isValid(start) && isValid(end)) {
        matchConditions.createdAt = {
          $gte: start,
          $lte: end,
        };
      }
    }

    const groupedData = await Order.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    // 🎨 Assign color codes here (backend-controlled)
    const statusColorMap = {
      Complete: "#00C49F",
      Started: "#FFBB28",
      Scanning: "#8884d8",
      Cancelled: "#FF8042",
    };

    const coloredData = groupedData.map((item) => ({
      ...item,
      color: statusColorMap[item.status] || "#cccccc", // fallback color
    }));

    // Add total at the end
    const totalCount = coloredData.reduce((sum, item) => sum + item.count, 0);
    coloredData.push({ status: "Total", count: totalCount });

    return res.status(200).json({
      data: coloredData,
      message: "Dashboard data loaded",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Load_Dashboard error:", error);
    next(error);
  }
};
