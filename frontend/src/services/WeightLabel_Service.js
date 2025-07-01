import { POST_Api, GET_Api, UPDATE_Api, DELETE_Api } from "./ApiService";
import { handleApiError } from "@/utils/handleApiError";

export const Get_kitReportData_Service = async ({
  order_number,
  bag_number,
}) => {
  try {
    // Input validation
    if (!order_number?.trim() || !bag_number?.trim()) {
      throw new Error("order_number or bag_number is missing or empty.");
    }

    const response = await POST_Api(`/kit_report/byOrderBagNo`, {
      order_number: order_number.trim(),
      bag_number: bag_number.trim(),
    });

    // Response structure validation (optional, depending on your API)
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format from server.");
    }

    // Check for application-level errors
    if (response.status === "error" || response.error) {
      throw new Error(response.message || "API returned an error.");
    }

    // If the response is successful
    console.log("1. Get_kitReportData_Service...", response);
    return response;
  } catch (error) {
    return handleApiError(error, "Failed to Get_kitReportData_Service.");
  }
};

export const Load_MainKitData_Service = async () => {
  try {
    const response = await GET_Api(`/main_kit/load_unique`);
    // If the response is successful
    console.log("2. Get_kitReportData_Service...", response);
    return response;
  } catch (error) {
    return handleApiError(error, "Failed to Get_kitReportData_Service.");
  }
};

export const Load_CompletedKit_Service = async (order_number, bag_number) => {
  try {
    const response = await POST_Api(`/kit_report/load_completeKit_ByOrderBag`, {
      order_number,
      bag_number,
    });
    // If the response is successful
    console.log("2. Get_kitReportData_Service...", response);
    return response;
  } catch (error) {
    return handleApiError(error, "Failed to Load_CompletedKit_Service.");
  }
};

export const Update_ScanData_Service = async (
  kitReport_updateDate,
  order_updateData
) => {
  try {
    // 1. update kit_report ..
    const response1 = await POST_Api(
      `/kit_report/updateKitReport_ByWeightLabel`,
      {
        kitReport_updateDate,
      }
    );
    // If the response is successful
    console.log("1. Update_KitReport...", response1);

    // 2. update order ...
    const response2 = await POST_Api(`/order/updateOrder_ByWeightLabel`, {
      order_updateData,
    });
    // If the response is successful
    console.log("2. Update_OrderData...", response2);

    return response2;
  } catch (error) {
    return handleApiError(error, "Failed to Update_KitReport_Service.");
  }
};
