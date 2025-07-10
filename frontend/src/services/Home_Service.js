import { POST_Api, GET_Api, UPDATE_Api, DELETE_Api } from "./ApiService";
import { handleApiError } from "@/utils/handleApiError";

export const Load_Home_Service=async(startDate, endDate)=>{
try {
     const response = await POST_Api(`/dashboard/load`, {
          startDate,
          endDate,
        });
        // If the response is successful
        console.log("1. Load_Home_Service...", response);
        return response;
} catch (error) {
     return handleApiError(error, "Failed to Load_Home_Service.");
}
}