import React from "react";
import { POST_Api, GET_Api, UPDATE_Api, DELETE_Api } from "./ApiService";

// get_UID
export const Get_SerialUID_Service = async () => {
  try {
    const result0 = await GET_Api(`/uid/get_serial_uid/fixed_id_1`);
    console.log("0. Get_SerialUID_Service...", result0);
    return result0;
  } catch (error) {
    console.log("Error Get_SerialUID_Service :", error);
    return false;
  }
};

// update_UID
export const Update_SerialUID_Service = async () => {
  try {
    const result0 = await POST_Api(`/uid/update_serial_uid/fixed_id_1`, {});
    console.log("0. Get_SerialUID_Service...", result0);
    return result0;
  } catch (error) {
    console.log("Error Get_SerialUID_Service :", error);
    return false;
  }
};

// load kit_report
export const Load_KitReport_Service = async (startDate, endDate) => {
  try {
    // Input validation
    if (!startDate || !endDate) {
      throw new Error("Start date or end date is missing.");
    }

    const result1 = await POST_Api(`/kit_report/load`, { startDate, endDate });
    console.log("1. Load_Order_Service...", result1);
    return result1;
  } catch (error) {
    console.log("Error Get_SerialUID_Service :", error);
    return false;
  }
};
// get OrderData
export const Get_OrderData_Service = async (order_number) => {
  try {
    if (!order_number) {
      console.log("Error : Order Number Missing ?");
      return false;
    }

    const result1 = await GET_Api(`/order/get_ByOrderNo/${order_number}`);
    console.log("1. Get_OrderData_Service...", result1);
    return result1;
  } catch (error) {
    console.log("Error Get_OrderData_Service :", error);
    return false;
  }
};

// load
export const Load_OrderNumber_Service = async () => {
  try {
    const result2 = await GET_Api(`/order/load_orderNumber`);
    console.log("2. Load_OrderNumber_Service...", result2);
    return result2;
  } catch (error) {
    console.log("Error Load_OrderNumber_Service :", error);
    return false;
  }
};

// save
export const Save_StartOrder_Service = async (qtyAdd, startData) => {
  try {
    // update order details
    const result3 = await POST_Api(
      `/order/update_orderStart/${startData._id}`,
      {
        start_qty: qtyAdd,
        status: startData.status,
      }
    );
    console.log("1. Save_StartOrder_Service...", result3);

    // save kit_report
    const kitReport_data = {
      bag_number: startData.bag_number,
      order_number: startData.order_number,
      status: "Start",
      actual_weight: "",
      pack_date: "",
      shift: "",
      employee: "",
    };
    const result4 = await POST_Api(`/kit_report/insert`, {
      kitReport_data: kitReport_data,
      qty: startData.to_startQty,
    });
    console.log("2. insert_KitReport...", result4);
    return result4;
  } catch (error) {
    console.log("Error Save_StartOrder_Service :", error);
    return false;
  }
};

// update
export const Update_StartOrder_Service = async (orderData) => {
  try {
    const { _id: id } = orderData;

    const result4 = await UPDATE_Api(
      `/order/update_orderStart/${id}`,
      orderData
    );
    console.log("4. Update_Order_Service...", result4);
    return result4;
  } catch (error) {
    console.log("Error Update_Order_Service :", error);
    return false;
  }
};

// delete
export const Delete_StartOrder_Service = async (id) => {
  try {
    const result5 = await DELETE_Api(`/start_order/delete/${id}`);
    console.log("5. Delete_Order_Service...", result5);
    return result5;
  } catch (error) {
    console.log("Error Delete_Order_Service :", error);
    return false;
  }
};
