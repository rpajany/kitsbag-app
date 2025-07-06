import { POST_Api, GET_Api, UPDATE_Api, DELETE_Api } from "./ApiService";
import { handleApiError } from "@/utils/handleApiError";
import { toast } from "react-toastify";

export const Load_BinStock_Service = async (startDate, endDate) => {
  try {
    const response = await POST_Api(`/stock_report/load`, {
      startDate,
      endDate,
    });
    // If the response is successful
    console.log("1. Load_BinStock_Service...", response);
    return response;
  } catch (error) {
    return handleApiError(error, "Failed to Load_BinStock_Service.");
  }
};

export const Load_AutoComplete_Service = async () => {
  try {
    const response = await POST_Api(`/child_master/load`);
    // If the response is successful
    console.log("2. Load_AutoComplete_Service...", response);
    return response;
  } catch (error) {
    return handleApiError(error, "Failed to Load_AutoComplete_Service.");
  }
};

export const Save_BinStock_Service = async (binStockData) => {
  try {
    console.log("binStockData :", binStockData);

    const { _id: id, updated_stock } = binStockData;

    if (!id) {
      console.log("Update id Missing...");
      toast.error("Update id Missing...");
      return;
    }

    // 1. update child_master stock by id...
    const response1 = await UPDATE_Api(`/child_master/update_stock/${id}`, {
      updated_stock: updated_stock,
    });

    console.log("1. Update child_master stock by id.", response1);

    // 2. Save stock Report...

    const stockReport_data = {
      part_id: binStockData._id,
      part_number: binStockData.part_number,
      description: binStockData.description,
      // location: binStockData.location,
      // bin_number: binStockData.bin_number,
      stock_qty: binStockData.stock_qty,
      transact_qty: binStockData.transact_qty,
      hand_qty: binStockData.updated_stock,
      remarks: binStockData.stock_action || "",
      employee: binStockData.employee,
    };
    const response2 = await POST_Api(`/stock_report/insert`, stockReport_data);

    console.log("2. Save Stock Report.", response2);
    console.log("stockReport_data :", stockReport_data);

    return response2;
  } catch (error) {
    return handleApiError(error, "Failed to Save_BinStock_Service.");
  }
};

// update
export const Update_BinStock_Service = async (childMasterData) => {
  try {
    const { _id: id } = childMasterData;

    const result3 = await UPDATE_Api(
      `/child_master/update/${id}`,
      childMasterData
    );
    console.log("3. Update_ChildKit_Service...", result3);
    return result3;
  } catch (error) {
    console.log("Error Update_ChildKit_Service :", error);
    return false;
  }
};

// delete
export const Delete_BinStock_Service = async (DeleteRow) => {
  try {
    console.log("row :", DeleteRow);

    const { part_id } = DeleteRow;

    if (!part_id) {
      console.log("Update id Missing...");
      toast.error("Update id Missing...");
      return;
    }

    // 1. get stock_qty from recent child_master details by _id
    const response_ChildMaster = await GET_Api(
      `/child_master/getByID/${part_id}`
    );

    const childMaster_Data = response_ChildMaster?.data?.data[0];
    console.log("1. Child master data :", childMaster_Data);
    const { stock_qty } = childMaster_Data;
    // 2.  get stock report remarks type "Add-Stock"/"Minus-Stock"
    const { remarks, transact_qty } = DeleteRow;

    // 3. if "Add-Stock" transact_qty - 5 , minus 5 from stock_qty
    // 4. if "Minus-Stock" transact_qty - 5 , add 5 to stock_qty
    let updatedStock = 0;
    if (remarks && remarks === "Add-Stock") {
      updatedStock = parseFloat(stock_qty) - parseFloat(transact_qty);
    } else if (remarks && remarks === "Minus-Stock") {
      updatedStock = parseFloat(stock_qty) + parseFloat(transact_qty);
    }

    // 6. update stock report remarks type "Delete :Stock-RollBack"
    const stockReport_data = {
      part_id: childMaster_Data._id,
      part_number: childMaster_Data.part_number,
      description: childMaster_Data.description,
      // location: binStockData.location,
      // bin_number: binStockData.bin_number,
      stock_qty: stock_qty,
      transact_qty: transact_qty,
      hand_qty: updatedStock,
      remarks: "Delete : Stock-RollBack",
    };

     console.log("stockReport_data :", stockReport_data);
    const response1 = await POST_Api(`/stock_report/insert`, stockReport_data);

    console.log("1. Save Stock Report.", response1);


    // 5. update stock_qty /child_master/update_stock/${id}
    const response2 = await UPDATE_Api(
      `/child_master/update_stock/${part_id}`,
      {
        updated_stock: updatedStock,
      }
    );
    console.log("2. Update child_master stock by id.", response2);  
   
    return response2;
  } catch (error) {
    console.log("Error Delete_ChildKit_Service :", error);
    return false;
  }
};
