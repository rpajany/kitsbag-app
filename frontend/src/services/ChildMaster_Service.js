import { POST_Api, GET_Api, UPDATE_Api, DELETE_Api } from "./ApiService";
import { handleApiError } from "@/utils/handleApiError";

export const Load_ChildMaster_Service = async (startDate, endDate) => {
  try {
    const response = await POST_Api(`/child_master/load`, {
      startDate,
      endDate,
    });
    // If the response is successful
    console.log("1. Load_ChildMaster_Service...", response);
    return response;
  } catch (error) {
    return handleApiError(error, "Failed to Load_ChildMaster_Service.");
  }
};

export const Save_ChildMaster_Service = async (childMasterData) => {
  try {
    const response = await POST_Api(`/child_master/insert`, childMasterData);
    // If the response is successful
    console.log("2. Save_ChildMaster_Service...", response);
    return response;
  } catch (error) {
    return handleApiError(error, "Failed to Save_ChildMaster_Service.");
  }
};

// update
export const Update_ChildMaster_Service = async (childMasterData) => {
  try {
    const { _id: id } = childMasterData;

    const result3 = await UPDATE_Api(`/child_master/update/${id}`, childMasterData);
    console.log("3. Update_ChildKit_Service...", result3);
    return result3;
  } catch (error) {
    console.log("Error Update_ChildKit_Service :", error);
    return false;
  }
};

// delete
export const Delete_ChildMaster_Service = async (id) => {
  try {
    const result4 = await DELETE_Api(`/child_master/delete/${id}`);
    console.log("4. Delete_ChildKit_Service...", result4);
    return result4;
  } catch (error) {
    console.log("Error Delete_ChildKit_Service :", error);
    return false;
  }
};
