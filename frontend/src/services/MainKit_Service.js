import React from "react";

import { POST_Api, GET_Api, UPDATE_Api, DELETE_Api } from "./ApiService";
 
import { handleApiError } from "@/utils/handleApiError";
 
  
 
  
// load
export const Load_MainKit_Service = async (startDate, endDate) => {

  try {
    // Input validation
    if (!startDate || !endDate) {
      throw new Error("Start date or end date is missing.");
    }

    const response = await POST_Api(`/main_kit/load`, {startDate, endDate});

      // Response structure validation (optional, depending on your API)
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format from server.");
    }

    // Check for application-level errors
    if (response.status === "error" || response.error) {
      throw new Error(response.message || "API returned an error.");
    }
    
     // If the response is successful
    console.log("1. Load_MainKit_Service...", response);
    return response;
  } catch (error) {
    // console.log("Error Load_MainKit_Service :", error);
    // return false;
    return handleApiError(error, "Failed to load main kit data.");
  }
};

// save
export const Save_MainKit_Service = async (parentKitData) => {
  try {
    const result2 = await POST_Api(`/main_kit/insert`, parentKitData);
    console.log("2. Save_MainKit_Service...", result2);
    return result2;
  } catch (error) {
    console.log("Error Save_MainKit_Service :", error);
    return false;
  }
};

// update
export const Update_MainKit_Service = async (parentKitData) => {
  try {
    const { _id: id } = parentKitData;

    const result3 = await UPDATE_Api(`/main_kit/update/${id}`, parentKitData);
    console.log("3. Update_MainKit_Service...", result3);
    return result3;
  } catch (error) {
    console.log("Error Update_MainKit_Service :", error);
    return false;
  }
};

// delete
export const Delete_MainKit_Service = async (id) => {
  try {
    const result4 = await DELETE_Api(`/main_kit/delete/${id}`);
    console.log("4. Delete_MainKit_Service...", result4);
    return result4;
  } catch (error) {
    console.log("Error Delete_MainKit_Service :", error);
    return false;
  }
};
