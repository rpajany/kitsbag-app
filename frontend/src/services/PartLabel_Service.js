import React from "react";
import { POST_Api, GET_Api, UPDATE_Api, DELETE_Api } from "./ApiService";

// load
export const Load_Order_Service = async () => {
  try {
    const result1 = await GET_Api(`/order/load`);
    console.log("1. Load_Order_Service...", result1);
    return result1;
  } catch (error) {
    console.log("Error Load_Order_Service :", error);
    return false;
  }
};

// load BagNumber
export const Load_BagNumber_Service = async () => {
  try {
    const result2 = await GET_Api(`/main_kit/load_bagNumber`);
    console.log("2. Load_BagNumber_Service...", result2);
    return result2;
  } catch (error) {
    console.log("Error Load_BagNumber_Service :", error);
    return false;
  }
};

// load PartKits
export const Load_ChildKits_Service = async (bagNumber) => {
  try {
    const result2 = await GET_Api(`/child_kit/get_ByBagNumber/${bagNumber}`);
    console.log("2. Load_ChildKits_Service...", result2);
    return result2;
  } catch (error) {
    console.log("Error Load_ChildKits_Service :", error);
    return false;
  }
};

// save
export const Save_Order_Service = async (orderData) => {
  try {
    console.log("orderData :", orderData);
    const result3 = await POST_Api(`/order/insert`, orderData);
    console.log("3. Save_Order_Service...", result3);
    return result3;
  } catch (error) {
    console.log("Error Save_Order_Service :", error);
    return false;
  }
};

// update
export const Update_Order_Service = async (orderData) => {
  try {
    const { _id: id } = orderData;

    const result4 = await UPDATE_Api(`/order/update/${id}`, orderData);
    console.log("4. Update_Order_Service...", result4);
    return result4;
  } catch (error) {
    console.log("Error Update_Order_Service :", error);
    return false;
  }
};

// delete
export const Delete_Order_Service = async (id) => {
  try {
    const result5 = await DELETE_Api(`/order/delete/${id}`);
    console.log("5. Delete_Order_Service...", result5);
    return result5;
  } catch (error) {
    console.log("Error Delete_Order_Service :", error);
    return false;
  }
};
