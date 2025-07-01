import React from "react";
import { POST_Api, GET_Api, UPDATE_Api, DELETE_Api } from "./ApiService";

// load
export const Load_ChildKit_Service = async (startDate, endDate) => {
  try {
    // Input validation
    if (!startDate || !endDate) {
      throw new Error("Start date or end date is missing.");
    }

    const result1 = await POST_Api(`/child_kit/load`, {startDate, endDate});
    console.log("1. Load_ChildKit_Service...", result1);
    return result1;
  } catch (error) {
    console.log("Error Load_ChildKit_Service :", error);
    return false;
  }
};

// save
export const Save_ChildKit_Service = async (childKitData) => {
  try {
    const result2 = await POST_Api(`/child_kit/insert`, childKitData);
    console.log("2. Save_ChildKit_Service...", result2);
    return result2;
  } catch (error) {
    console.log("Error Save_ChildKit_Service :", error);
    return false;
  }
};

// update
export const Update_ChildKit_Service = async (childKitData) => {
  try {
    const { _id: id } = childKitData;

    const result3 = await UPDATE_Api(`/child_kit/update/${id}`, childKitData);
    console.log("3. Update_ChildKit_Service...", result3);
    return result3;
  } catch (error) {
    console.log("Error Update_ChildKit_Service :", error);
    return false;
  }
};

// delete
export const Delete_ChildKit_Service = async (id) => {
  try {
    const result4 = await DELETE_Api(`/child_kit/delete/${id}`);
    console.log("4. Delete_ChildKit_Service...", result4);
    return result4;
  } catch (error) {
    console.log("Error Delete_ChildKit_Service :", error);
    return false;
  }
};
