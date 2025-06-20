import React from "react";
import { POST_Api, GET_Api, DELETE_Api } from "./ApiService";

export const Load_MainKit_Service = async () => {
  try {
    const result1 = await GET_Api(`/kit_master/load`);
    console.log("1. Load_MainKit_Service...", result1);
    return result1;
  } catch (error) {
    console.log("Error Load_MainKit_Service :", error);
    return false;
  }
};

export const Save_MainKit_Service = async (parentKitData) => {
  try {
    const result2 = await POST_Api(`/kit_master/insert`, parentKitData);
    console.log("2. Save_MainKit_Service...", result2);
    return result2;
  } catch (error) {
    console.log("Error Save_MainKit_Service :", error);
    return false;
  }
};

export const Update_MainKit_Service = async () => {};
