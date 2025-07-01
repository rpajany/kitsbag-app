import React, { useRef, useEffect, useState } from "react";
import {
  DataTableVIew,
  CalenderModel,
  Combobox,
  ComboboxDynamic,
  DataTableCheckbox,
} from "../components";
import {
  Load_OrderNumber_Service,
  Get_OrderData_Service,
} from "../services/StartOrder_Service";
import {
  Get_kitReportData_Service,
  Load_MainKitData_Service,
  Update_ScanData_Service,
  Load_CompletedKit_Service,
} from "../services/WeightLabel_Service";
import { useZebraPrinter } from "../services/BrowserPrint_Service";
import { useWeightService } from "../hooks/useWeightService";
import { format } from "date-fns";
import { MultiKit } from ".";
import { Weight, PrinterCheck, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

export const WeightLabel = () => {
  const inputRef = useRef(null);
  const { weight, port, Get_Weight } = useWeightService();

  const label_InitialValue = {
    _id: "",
    shift: "",
    date: "",
    order_number: "",
    bag_number: "",
    order_qty: 0,
    start_qty: 0,
    scan_qty: 0,
    pending_qty: 0,
    kit_serial: "",
    scale_weight: 1.55,
    port: "",
    employee: "7029",
  };

  const [labelData, setLabelData] = useState(label_InitialValue);
  const [mainKitData, setMainKitData] = useState([]);

  const [orderData, setOrderData] = useState([]);
  const [kitReportData, setKitReportData] = useState([]);

  const [orderComboValue, setOrderComboValue] = useState("");
  const [orderComboData, setOrderComboData] = useState([]);

  const [bagComboValue, setBagComboValue] = useState("");
  const [bagComboData, setBagComboData] = useState([]);

  const [tableData, setTableData] = useState([]); // [] sampleData
  const [rePrintData, setRePrintData] = useState([]);

  const { printZPL } = useZebraPrinter();
  const [date, setDate] = useState(new Date());
  const [headerValue, setHeaderValue] = useState([
    "serial_number",
    "Bag_Number",
    "actual_weight",
    "order_number",
    "pack_date",
    "shift",
    "employee",
  ]); // []

  useEffect(() => {
    setLabelData((prev) => ({
      ...prev,

      // scale_weight: weight,
      // port: port,
      date: format(date, "yyyy-MM-dd"),
    }));
  }, [weight, port, date]); //

  console.log("labelData :", labelData);
  console.log("mainKitData :", mainKitData);
  // console.log("port", port);

  // load main kit data...
  const load_mainKitData = async () => {
    try {
      const result = await Load_MainKitData_Service();
      const fetchedData = result?.data?.data;
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        setMainKitData(fetchedData);
      } else {
        console.warn("Expected an array, got:", fetchedData);
        setMainKitData([]);
      }
    } catch (error) {
      console.log("Error Load Order Data:", error);
    }
  };

  // load completed kit data...
  const load_CompletedKit_Data = async () => {
    try {
      const result = await Load_CompletedKit_Service(
        orderComboValue,
        bagComboValue
      );

      const fetchedData = result?.data?.data;
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        setTableData(fetchedData);
      } else {
        console.warn("Expected an array, got:", fetchedData);
        setMainKitData([]);
      }
    } catch (error) {
      console.log("Error load_CompletedKit_Data:", error);
    }
  };

  useEffect(() => {
    load_mainKitData();
  }, []);

  // This function will be triggered when Combobox opens
  const fetch_OrderComboData = async () => {
    try {
      // Small delay if needed
      await new Promise((resolve) => setTimeout(resolve, 100)); //300

      const result = await Load_OrderNumber_Service();
      const fetchedData = result?.data?.data;

      // console.log("load_BagNumbers:", fetchedData);

      if (Array.isArray(fetchedData)) {
        setOrderComboData(fetchedData);
      } else {
        console.warn("Expected an array, got:", fetchedData);
      }
    } catch (error) {
      console.log("Error Load Order Data:", error);
    }
  };

  useEffect(() => {
    setLabelData((prev) => ({
      ...prev,
      order_number: orderComboValue, // Sync Combo Box to orderData
    }));

    setBagComboData([]); // clear bagComboDate on order change
    setBagComboValue(""); // clear bagComboValue on order change
  }, [orderComboValue]);

  const Get_DataByOrderNumber = async (orderComboValue) => {
    try {
      if (orderComboValue === "") {
        console.log("Missing Order Number !");
        return;
      }
      const result = await Get_OrderData_Service(orderComboValue);
      const rowData = result?.data?.data;

      // console.log("Load Data :", rowData);

      if (Array.isArray(rowData) && rowData.length > 0) {
        // setLabelData((prev) => ({
        //   ...prev,
        //   _id: rowData[0]._id,
        //   bag_number: rowData[0].bag_number,
        //   description: rowData[0].description,
        //   order_qty: rowData[0].order_qty,
        //   start_qty: rowData[0].start_qty,

        // }));
        setOrderData(rowData);
      } else {
        console.warn("Expected an array, got:", rowData);
      }
    } catch (error) {
      console.log("Error Get_DataByOrderNumber :", error);
    }
  };

  console.log("orderData :", orderData);

  useEffect(() => {
    Get_DataByOrderNumber(orderComboValue);
  }, [orderComboValue]);

  // update bag combo when orderData updated
  useEffect(() => {
    if (orderData.length > 0) {
      const update_Bags = orderData.map((item) => ({
        // comboBox.js needs  objects with .label and .value
        label: item.bag_number,
        value: item.bag_number,
      }));
      setBagComboData(update_Bags);
    } else {
      setBagComboData([]);
    }
  }, [orderData]);

  // GET kit_report data by oder_number & bag_number on bagComboValue select :
  const Get_kitReportByOrderBagNo = async (orderComboValue, bagComboValue) => {
    console.log("function called !!");
    console.log("orderComboValue :", orderComboValue);
    console.log("bagComboValue :", bagComboValue);
    try {
      const orderNumber = orderComboValue?.trim() || "";
      const bagNumber = bagComboValue?.trim() || "";

      if (!orderNumber || !bagNumber) {
        console.log("Missing or invalid Order/Bag Number !");
        return;
      }

      const result = await Get_kitReportData_Service({
        order_number: orderNumber,
        bag_number: bagNumber,
      });

      const rowData = result?.data?.data;

      if (Array.isArray(rowData) && rowData.length > 0) {
        setKitReportData(rowData);
      } else {
        setKitReportData([]); // Clear old data if necessary
        console.warn("Expected an array, got:", rowData);
      }
    } catch (error) {
      console.log("Error Get_DataByOrderNumber :", error);
    }
  };

  console.log("kitReportData :", kitReportData);

  // on select bag combo item ...
  useEffect(() => {
    const selected_kit = orderData.find(
      (item) => item.bag_number === bagComboValue
    );

    if (selected_kit) {
      setLabelData((prev) => ({
        ...prev,
        _id: selected_kit._id,
        bag_number: selected_kit.bag_number,
        description: selected_kit.description,
        order_qty: selected_kit.order_qty,
        start_qty: selected_kit.start_qty,
        scan_qty: selected_kit.complete_qty,
        pending_qty: selected_kit.pending_qty,
      }));
    } else {
      // Optionally reset values if no match
      setLabelData((prev) => ({
        ...prev,
        bag_number: "",
        description: "",
        order_qty: 0,
        start_qty: 0,
        scan_qty: 0,
        pending_qty: 0,
      }));
    }

    Get_kitReportByOrderBagNo(orderComboValue, bagComboValue);
    load_CompletedKit_Data(orderComboValue, bagComboValue);
  }, [bagComboValue]);

  const handle_InputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["scan_qty", "pending_qty", "start_qty", "order_qty"];
    setLabelData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handle_kitSerial_Change = (e) => {
    const { name, value } = e.target;
    setLabelData((prev) => ({
      ...prev,
      kit_serial: value ? parseInt(value) : value,
    }));
  };

  const handle_kitSerial_KeyDown = async (e) => {
    if (e.key === "Enter") {
      console.log("Enter key pressed:");
      e.preventDefault();
      // Call a function or trigger an action
      const { name, value } = e.target;

      // toast.info(`serial No : ${labelData.serial_number} `);

      const scan_SerialNumber = value ? parseInt(value) : value;

      // 1. get bag_number from kit_reports using serial_number
      const matched_KitItem = kitReportData.find(
        (item) => item.serial_number === scan_SerialNumber
      );

      if (matched_KitItem === undefined || null) {
        toast.info(`No match Serial for this Kit: ${scan_SerialNumber} `);
        return;
      }
      // Get bag_number if match is found
      const kit_id = matched_KitItem ? matched_KitItem._id : null;
      const bagNumber = matched_KitItem ? matched_KitItem.bag_number : null;
      const orderNumber = matched_KitItem ? matched_KitItem.order_number : null;

      // toast.info(`bagNumber : ${bagNumber} `);
      // toast.info(`orderNumber : ${orderNumber} `);

      // 2. get min_weight & max_weight from main_kits using bag_number
      const matched_mainKitItem = mainKitData.find(
        (item) => item.bag_number === bagNumber
      );
      const minWeight = matched_mainKitItem
        ? parseFloat(matched_mainKitItem.min_weight)
        : 0;
      const maxWeight = matched_mainKitItem
        ? parseFloat(matched_mainKitItem.max_weight)
        : 0;

      // toast.info(`minWeight : ${minWeight} `);
      // toast.info(`maxWeight : ${maxWeight} `);

      // 3. compare current weight with min_weight & max_weight
      console.log("labelData.scale_weight :", labelData.scale_weight);
      const scaleWeight = parseFloat(labelData.scale_weight);
      toast.info(`scaleWeight : ${scaleWeight} `);

      if (scaleWeight >= minWeight && scaleWeight <= maxWeight) {
        toast.success(`Weight Match`);
        // Update Scan Kit Report
        // SqLite_transact.Update("UPDATE tbl_KIT_Report SET Actual_Weight='" + scaleWeight + "', Status='Complete', Pack_Date='" + packDate + "', Shift ='" + Shift_Cbo.Text.Trim() + "', Employee='" + txt_EmpNo.Text.Trim() + "' WHERE Item_Code='" + txt_ItemCode.Text.Trim() + "' AND Serial_Number='" + txt_SerialNum.Text.Trim() + "' LIMIT 1");
        //  string packDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");

        // KitData :
        const packDate = new Date();

        const kitReport_updateDate = {
          _id: kit_id,
          serial_number: scan_SerialNumber,
          actual_weight: scaleWeight,
          pack_date: packDate,
          shift: labelData.shift,
          employee: labelData.employee,
          status: "Complete",
        };

        // orderData :
        const kit_scanQty = parseFloat(labelData.scan_qty) + 1;
        const pendingQty = parseFloat(labelData.order_qty) - kit_scanQty;

        setLabelData((prev) => ({
          ...prev,
          scan_qty: kit_scanQty,
          pending_qty: pendingQty,
        }));

        const matched_orderItem = orderData.find(
          (item) =>
            item.bag_number === bagNumber && item.order_number === orderNumber
        );

        const order_id = matched_orderItem ? matched_orderItem._id : null;

        const order_updateData = {
          _id: order_id,
          order_number: orderNumber,
          bag_number: bagNumber,
          complete_qty: kit_scanQty,
          pending_qty: pendingQty,
          status: pendingQty == 0 ? "Complete" : "Scanning",
        };

        const result = await Update_ScanData_Service(
          kitReport_updateDate,
          order_updateData
        );

        // re-load order & Kitreport
        Get_DataByOrderNumber(orderComboValue);
        Get_kitReportByOrderBagNo(orderComboValue, bagComboValue);
        const rowData = result?.data?.data;
        if (rowData.success) {
          toast.success("Kit Scanned !");
        }
        // Update Order Complete Qty
        // "SELECT COUNT(Order_Number) AS Order_Number FROM tbl_KIT_Report WHERE Item_Code='" + txt_ItemCode.Text.Trim() + "' AND Order_Number='" + orderNumber + "' AND Status='Complete'"
        // Update tbl_Order Status ...
        // SqLite_transact.Update("UPDATE tbl_Order SET Status='Complete' WHERE Item_Code='" + txt_ItemCode.Text.Trim() + "' AND Order_Number='" + order_number + "' LIMIT 1");
        // Print 1 Label
      } else {
        toast.error("Weight Not Match");
        // Focus the input
        inputRef.current.focus();
      }
      // 4. if pass update kit_reports actual_weight,status="Complete",pack_date,shift,employee
      // 5. update orders complete_qty,pending_qty

      // Focus the input
      inputRef.current.focus();
    }
  };

  //   useEffect(() => {
  //   // Focus the input on component mount
  //   inputRef.current.focus();
  // }, []);

  return (
    <>
      <div className="w-full border-2 rounded-sm">
        <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
          WeightLabel
        </div>
        {/* <h2>Weight : {weight} kg</h2>
        <h2>Port : {port} </h2> */}
        <form>
          <div className="w-full md:flex  gap-8 p-4 mt-2">
            <div className=" w-1/2 border-2 p-4 rounded-sm bg-yellow-100">
              

              <div className="grid grid-cols-2 gap-8 mb-2">
                <div className=" items-center ">
                  <label htmlFor="shift" className="label-style mr-4">
                    Shift
                  </label>

                  <select
                    name="shift"
                    id="shift"
                    value={labelData.shift}
                    onChange={handle_InputChange}
                    className="label-style border-2 h-9 px-2 w-full rounded-sm"
                  >
                    <option value="">--SELECT--</option>
                    <option value="GENERAL">GENERAL</option>
                    <option value="FIRST SHIFT">FIRST SHIFT</option>
                    <option value="SECOND SHIFT">SECOND SHIFT</option>
                    <option value="THIRD SHIFT">THIRD SHIFT</option>
                  </select>
                </div>

                <div className=" items-center mb-2">
                  <label htmlFor="order_date" className="label-style mr-4">
                    Date
                  </label>
                  <CalenderModel date={date} setDate={setDate} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-2">
                <div className="mb-2">
                  <label htmlFor="" className="label-style">
                    Search : Order Number
                  </label>
                  {/* <Combobox
                                  comboValue={comboValue}
                                  setComboValue={setComboValue}
                                  comboData={comboData}
                                /> */}

                  <ComboboxDynamic
                    comboValue={orderComboValue}
                    setComboValue={setOrderComboValue}
                    comboData={orderComboData}
                    fetchDataOnOpen={fetch_OrderComboData} // 🔁 Pass the function as prop
                  />
                </div>
                {/* <div>
                  <label htmlFor="order_number" className="label-style mr-2">
                    Order No #
                  </label>
                  <input
                    type="text"
                    id="order_number"
                    name="order_number"
                    value={labelData.order_number}
                    onChange={handle_InputChange}
                    className="input-style"
                    required
                  />
                </div> */}

                <div>
                  <label htmlFor="bag_number" className="label-style mr-2">
                    Bag No.
                  </label>
                  {/* <input
                    type="text"
                    id="bag_number"
                    name="bag_number"
                    value={labelData.bag_number}
                    onChange={handle_InputChange}
                    className="input-style"
                    required
                  /> */}

                  <Combobox
                    comboValue={bagComboValue}
                    setComboValue={setBagComboValue}
                    comboData={bagComboData}
                  />
                </div>
              </div>

              <div className="  grid grid-cols-2 gap-8 mb-2">
                <div className="  mb-2">
                  <label htmlFor="order_qty" className="label-style mr-2">
                    Order Qty
                  </label>
                  <input
                    type="text"
                    id="order_qty"
                    name="order_qty"
                    value={labelData.order_qty}
                    onChange={handle_InputChange}
                    className="input-style"
                    required
                  />
                </div>

                <div className="  mb-2">
                  <label htmlFor="start_qty" className="label-style mr-2">
                    Start Qty
                  </label>
                  <input
                    type="text"
                    id="start_qty"
                    name="start_qty"
                    value={labelData.start_qty}
                    onChange={handle_InputChange}
                    className="input-style"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="  mb-2">
                  <label htmlFor="scan_qty" className="label-style mr-2">
                    Scanned Qty
                  </label>
                  <input
                    type="text"
                    id="scan_qty"
                    name="scan_qty"
                    value={labelData.scan_qty}
                    onChange={handle_InputChange}
                    className="input-style"
                    required
                  />
                </div>

                <div className="  mb-2">
                  <label htmlFor="pending_qty" className="label-style mr-2">
                    Pending Qty
                  </label>
                  <input
                    type="text"
                    id="pending_qty"
                    name="pending_qty"
                    value={labelData.pending_qty}
                    onChange={handle_InputChange}
                    className="input-style"
                  />
                </div>
              </div>
            </div>

            {/* <div className="w-1/2">
              <MultiKit
                order_number={labelData.order_number}
                bag_number={labelData.bag_number}
              />
            </div> */}
          </div>

          <div className="flex ">
            {/* lower box-1  bg-indigo-300  */}
            <div className="w-1/2 m-4 p-4 mt-2 border-2 rounded-sm ">
              <div className="grid grid-cols-2 gap-8 ">
                <div className="mb-2">
                  <label htmlFor="" className="label-style">
                    Child Kit_PartNumber
                  </label>
                  <input
                    type="text"
                    id=""
                    name=""
                    value={0.0}
                    className="input-style"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="employee" className="label-style">
                    Emp.No #
                  </label>
                  <input
                    type="text"
                    id="employee"
                    name="employee"
                    value={labelData.employee}
                    onChange={handle_InputChange}
                    required
                    className="input-style"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="kit_serial" className="label-style">
                 Serial No.
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="kit_serial"
                  name="kit_serial"
                  value={labelData.kit_serial}
                  onChange={handle_kitSerial_Change}
                  onKeyDown={handle_kitSerial_KeyDown}
                  className="input-style"
                  placeholder="Scan Kit Serial No."
                  // autoComplete="off"
                />
              </div>

              <div className="w-full   rounded-sm mt-4 ">
                <DataTableCheckbox
                  headerValue={headerValue}
                  tableData={tableData}
                  selectedRows={rePrintData}
                  setSelectedRows={setRePrintData}
                />
              </div>

              <div className="mt-4 flex justify-between">
                <Button variant="default" size="sm">
                  <PrinterCheck className="w-24 h-24" /> Re Print
                </Button>

                <Button variant="outline" className="bg-green-400 ">
                  <FileDown />
                  Export
                </Button>
              </div>
            </div>{" "}
            {/* lower box-1 End */}
            {/* lower box-2 */}
            <div className="w-1/2 border-2 m-2 p-4 rounded-sm bg-pink-200">
            <div className="  grid grid-cols-2 gap-4 mb-2 pr-6">
                <div className="flex  items-center mb-2 w-1/2 ">
                  <label htmlFor="port" className="label-style mr-4">
                    Port
                  </label>
                  <input
                    type="text"
                    id="port"
                    name="port"
                    value={port}
                    readOnly
                    className="input-style bg-gray-200"
                  />
                </div>

                <div className=" flex  items-center   mb-2">
                  <label htmlFor="scale_weight" className="label-style mr-4">
                    scale_weight
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="scale_weight"
                      name="scale_weight"
                      value={labelData.scale_weight}
                      onChange={handle_InputChange}
                      readOnly
                      className="input-style mr-4 decoration-double bg-gray-200"
                    />{" "}
                    Kg
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <label htmlFor="" className="label-style">
                  Kit_Weight
                </label>
                <input
                  type="text"
                  id=""
                  name=""
                  value={0.0}
                  className="input-style"
                />
              </div>
            </div>
            {/* lower box-2 End */}
          </div>
        </form>
      </div>
    </>
  );
};
