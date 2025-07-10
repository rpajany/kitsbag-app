import React, { useEffect, useState } from "react";
import {
  DataTableVIew,
  CalenderModel,
  Combobox,
  ComboboxDynamic,
  DataTableCheckbox,
} from "../components";
import {
  Load_KitReport_Service,
  Load_AllKitReport_Service,
  Get_OrderData_Service,
  Load_OrderNumber_Service,
  Save_StartOrder_Service,
  Update_StartOrder_Service,
  Get_SerialUID_Service,
} from "../services/StartOrder_Service";
import { DateRangePicker } from "../components";
import { useZebraPrinter } from "../services/BrowserPrint_Service";
import { useDateRange } from "@/context/DateRangeContext";
import { Load_Order_Service } from "../services/Order_Service";
import { parse, format } from "date-fns";
import { SweetAlert_Delete, DateFormat, safeValue } from "../utils/custom";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

export const StartOrder = ({ load_OrderData }) => {
  const { API_DateRange } = useDateRange();
  const { printZPL } = useZebraPrinter();

  const startOrder_InitialValue = {
    _id: "",
    // serial_uid: "",
    order_number: "",
    bag_number: "",
    // description: "",

    order_qty: 0,
    start_qty: 0,
    to_startQty: 0,
    status: "Started",
  };

  const [startData, setStartData] = useState(startOrder_InitialValue);
  const [orderData, setOrderData] = useState([]);
  // const[selectedOrder, setSelectedOrder] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);

  // const [orderDate, setOrderDate] = useState(new Date());
  // const [deliveryDate, setDeliveryDate] = useState(new Date());

  const [orderComboValue, setOrderComboValue] = useState("");
  const [orderComboData, setOrderComboData] = useState([]);

  const [bagComboValue, setBagComboValue] = useState("");
  const [bagComboData, setBagComboData] = useState([]);

  const [headerValue, setHeaderValue] = useState([
    "Serial_Number",
    "Order_Number",
    "Bag_Number",
    "Status",
  ]); // []
  const [selectedRows, setSelectedRows] = useState([]); // table row select

  // const load_Data = async () => {
  //   try {
  //     const { startDate, endDate } = API_DateRange(); // get ISO strings
  //     setLoading(true);

  //     const result = await Load_KitReport_Service(startDate, endDate);
  //     if (result?.data?.success) {
  //       const fetchedData = result?.data?.data;
  //       console.log("Load Data :", fetchedData);

  //       if (Array.isArray(fetchedData) && fetchedData.length >= 1) {
  //         setApiData([...fetchedData]); // force new reference even if empty
  //       } else if (fetchedData.length === 0) {
  //         // console.warn("Expected an array, got:", fetchedData);
  //         console.log("Setting empty data: []");
  //         setApiData([]);
  //       }
  //     } else if (result.error) {
  //       toast.error(result.message); // or use dialog, alert, etc.
  //     }
  //   } catch (error) {
  //     console.log("Error Load Order Data:", error);
  //   }
  // };

  const load_AllkitReport_ByOrderBag = async () => {
    try {
      console.log("load_AllkitReport_ByOrderBag - called !!");
      if (!orderComboValue || !bagComboValue) {
        console.log("Error: order_number/bag_number is missing");
      }

      setLoading(true);

      const result = await Load_AllKitReport_Service(
        orderComboValue,
        bagComboValue
      );
      if (result?.data?.success) {
        const fetchedData = result?.data?.data;
        console.log("Load Data :", fetchedData);

        if (Array.isArray(fetchedData) && fetchedData.length >= 1) {
          setApiData([...fetchedData]); // force new reference even if empty
        } else if (fetchedData.length === 0) {
          // console.warn("Expected an array, got:", fetchedData);
          console.log("Setting empty data: []");
          setApiData([]);
        }
      } else if (result.error) {
        toast.error(result.message); // or use dialog, alert, etc.
      }
    } catch (error) {
      console.log("Error load_kitReport_ByOrderBag :", error);
    } finally {
      setLoading(false);
    }
  };

  // const Get_SerialUID = async () => {
  //   try {
  //     const result = await Get_SerialUID_Service();
  //     const _uid = result?.data?.data?.serial_uid;
  //     setStartData((prev) => ({
  //       ...prev,
  //       serial_uid: _uid,
  //     }));
  //   } catch (error) {
  //     console.log("Error Get_SerialUID :", error);
  //   }
  // };

  const Get_DataByOrderNumber = async (comboValue) => {
    try {
      if (comboValue === "") {
        console.log("Missing Order Number !");
        return;
      }
      const result = await Get_OrderData_Service(comboValue);
      const rowData = result?.data?.data;

      console.log("Get_DataByOrderNumber :", rowData);

      if (Array.isArray(rowData) && rowData.length > 0) {
        // setStartData((prev) => ({
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

  console.log("bagComboData :", bagComboData);
  console.log("orderData :", orderData);
  // console.log("startData :", startData);

  // const load_OrderNumbers = async () => {
  //   try {
  //     const result = await Load_OrderNumber_Service();
  //     const fetchedData = result?.data?.data;

  //     console.log("load_BagNumbers :", fetchedData);

  //     if (Array.isArray(fetchedData)) {
  //       setComboData(fetchedData);
  //     } else {
  //       console.warn("Expected an array, got:", fetchedData);
  //     }
  //   } catch (error) {
  //     console.log("Error Load Order Data:", error);
  //   }
  // };

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
        setOrderComboData([]);
      }
    } catch (error) {
      console.log("Error Load Order Data:", error);
    }
  };

  // useEffect(() => {
  //     load_Data();
  // }, [API_DateRange]);

  useEffect(() => {
    load_AllkitReport_ByOrderBag();
  }, [orderComboValue, bagComboValue]);

  useEffect(() => {
    Get_DataByOrderNumber(orderComboValue);
    setBagComboData([]); // clear bagComboDate on order change
    setBagComboValue(""); // clear bagComboValue on order change
  }, [orderComboValue]);

  useEffect(() => {
    setStartData((prev) => ({
      ...prev,
      order_number: orderComboValue, // Sync Combo Box to orderData
    }));
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

  // on select bag combo item ...
  useEffect(() => {
    const selected_kit = orderData.find(
      (item) => item.bag_number === bagComboValue
    );

    if (selected_kit) {
      setStartData((prev) => ({
        ...prev,
        _id: selected_kit._id,
        bag_number: selected_kit.bag_number,
        // description: selected_kit.description,
        order_qty: selected_kit.order_qty,
        start_qty: selected_kit.start_qty,
      }));
    } else {
      // Optionally reset values if no match
      setStartData((prev) => ({
        ...prev,
        bag_number: "",
        // description: "",
        order_qty: 0,
        start_qty: 0,
      }));
    }
  }, [bagComboValue]);

  const handle_InputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["order_qty", "to_startQty", "start_Qty"];
    setStartData((preve) => ({
      ...preve,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));

    // if (name == "to_startQty" && value >= 1) {
    //   add_StartQty(value);
    // }
  };

  // const add_StartQty = (startQty) => {
  //   // console.log("startQty", startQty);
  //   const qtyAdd = parseFloat(startData.start_qty) + parseFloat(startQty);
  //   setStartData((prev) => ({
  //     ...prev,
  //     start_qty: qtyAdd,
  //   }));
  // };

  const handle_FormSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(startData.start_qty) >= parseFloat(startData.order_qty)) {
      toast.info("Error: Start Qty equal to Order Qty");
      return;
    }

    const qtyAdd =
      parseFloat(startData.start_qty) + parseFloat(startData.to_startQty);

    console.log("qtyAdd :", qtyAdd);

    // if (qtyAdd <= startData.order_qty) {
    //   setStartData((prev) => ({
    //     ...prev,
    //     start_qty: qtyAdd,
    //   }));
    // } else {
    //   console.log("Exceeds Order Quantity");
    //   toast.info("Start Qty - Exceed Order Quantity!");
    //   return;
    // }

    try {
      setLoading(true);
      if (!isEdit) {
        // save function ...
        const result = await Save_StartOrder_Service(qtyAdd, startData);
        console.log("result :", result);
        if (result?.data?.success) {
          toast.success("Save Success!");
        } else {
          toast.error("Save Fail!");
        }
      } else if (isEdit) {
        // update function ...

        const { _id } = startData;

        if (_id == "") {
          toast.error("Edit Data 'ID' Missing !");
          return;
        }

        const result = await Update_StartOrder_Service(startData);
        console.log("result :", result);
        if (result?.data?.success) {
          toast.success("Update Success!");
        } else {
          toast.error("Update Fail!");
        }
      }
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setLoading(false);
      setIsEdit(false);
      setStartData(startOrder_InitialValue);
      setOrderComboValue("");
      setBagComboValue("");
      setBagComboData([]);
      // setOrderDate(new Date()); // ✅ Reset calendar date
      // setDeliveryDate(new Date()); // ✅ Reset calendar date
      // await load_Data(); not used...
      await load_AllkitReport_ByOrderBag();
      load_OrderData(); // call function in order page
    }
  };

  // const handleEdit = async (row) => {};

  // const handleDelete = async (row) => {};

  // print zpl function ...
  const handlePrint = (e) => {
    e.preventDefault();

    if (selectedRows.length <= 0) {
      toast.info("No print row Selected !");
      return;
    }

    // Single ZPL Data Generation for All Rows :
    const print_Speed = 4;
    const print_Dark = 20;
    const aDate = new Date().toLocaleDateString("en-GB").split("/").join("-");

    let fullZplData = "";

    // Loop through each selected row and build the ZPL label
    selectedRows.forEach((item) => {
      const serialNumber = item.serial_number;
      const orderNumber = item.order_number;
      const bagNumber = item.bag_number;

      // const itemQty = item.qty;

      const i_code1 = bagNumber.slice(0, 3).toUpperCase();
      const i_code2 = bagNumber.slice(3).toUpperCase();

      const O_Num1 = orderNumber.substring(0, 4);
      const O_Num2 = orderNumber.substring(4, 8);
      const O_Num3 = orderNumber.substring(8);

      // 200 dpi label ......
      const zplLines = [
        "CT~~CD,~CC^~CT~",
        `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR${print_Speed},${print_Speed}~SD${print_Dark}^JUS^LRN^CI0^XZ`,
        "^XA",
        "^MMT",
        "^PW831",
        "^LL1183",
        "^LS0",
        "^FO32,992^GFA,01536,01536,00012,:Z64:eJztkzEOgzAMRY0QYmTsmKOQW3TkEl0rerQegSMw9gAMnXCJY5IfmgqGDh2aAVmPb8f+ion+59ipITa3EBY9SDjyjm2IOfKiZ5BH3jGDPPCKI2+B90u81m9y+tGLhFsfC3+67pVfrST4O32C8H6K/fO8fErlPIR5mV2lRrmrUW97d/y+JKz8ATwMtYQz8Cnjwaa+TPDeT9Knk2v/fmDPh/UnkZd7fqHo/5jeXUCr5oP/yE+gL3nPf/qW/5KgXBKUH/KfgaP/I3BK/cd7jXIZQLlN/W/2/Tf5d4v+4zs/g/+4F13Of5K1i/vVwtuqgOOeJvuLe12DnoCr/yoCXtAvnxfXtQp8:66A3",
        "^FO28,23^GB776,1132,4^FS",
        "^FO194,27^GB0,1129,2^FS",
        "^FO31,955^GB165,0,3^FS",
        "^FT128,806^A0B,45,43^FH\\^FDPRODUCT IDENTIFICATION LABEL^FS",
        `^FT254,1116^A0B,31,28^FH\\^FDBag Number : ${bagNumber}^FS`,
        "^BY2,3,55^FT323,389^BCB,,N,N",
        `^FD>:${O_Num1}>5${O_Num2}>6${O_Num3}^FS`,
        "^BY2,3,55^FT329,1116^BCB,,N,N",
        `^FD>;${i_code1}>6${i_code2}^FS`,
        "^BY2,3,56^FT514,1116^BCB,,N,N",
        `^FD>;${serialNumber}^FS`,
        "^FT585,1085^A0B,31,28^FH\\^FD'NOT FOR RETAIL SALE'^FS",
        "^FT599,602^A0B,31,28^FH\\^FDSupplier ;^FS",
        "^FT651,600^A0B,31,28^FH\\^FDWittur Elevator Components India Pvt Ltd.,^FS",
        "^FT689,600^A0B,31,28^FH\\^FDSIPCOT Industrial Estate,^FS",
        "^FT727,600^A0B,31,28^FH\\^FDSriperumbudur,^FS",
        "^FT765,600^A0B,31,28^FH\\^FDTamilNadu - 602105^FS",
        `^FT381,389^A0B,31,28^FH\\^FDDate : ${aDate}^FS`,
        `^FT251,389^A0B,31,28^FH\\^FDOrder : ${orderNumber}^FS`,
        `^FT437,1116^A0B,31,28^FH\\^FDSerial.No: ${serialNumber}^FS`,
        // `^FT381,1116^A0B,31,28^FH\\^FDItem Name : ${itemName}^FS`,
        "^FT159,1111^A0B,31,28^FH\\^FDWITTUR^FS",
        "^PQ1,0,1,Y^XZ",
        "",
      ];

      fullZplData += zplLines.join("\n") + "\n";
    });

    // Send all label's to printer
    printZPL(fullZplData);
  };

  // Define table columns
  const columns = [
    {
      name: "Serial #",
      selector: (row) => row.serial_number,
      sortable: true,
    },
    {
      name: "Order_No",
      selector: (row) => row.order_number,
      sortable: true,
    },
    {
      name: "Bag_No",
      selector: (row) => row.bag_number,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    // {
    //   name: "Rate",
    //   selector: (row) => row.rate,
    //   sortable: true,
    // },
    // {
    //     name: 'Status',
    //     selector: row => <span onClick={() => handleStatusClick(row)} className={`p-4  rounded-full text-white  font-extralight hover:cursor-pointer ${row.Status === 'CLOSED' ? 'bg-green-400' :
    //         row.Status === 'PENDING' ? 'bg-blue-400' :
    //             row.Status === 'REJECTED' ? 'bg-orange-400' :
    //                 row.Status === 'CANCEL' ? 'bg-yellow-400' :
    //                     row.Status === 'OPEN' ? 'bg-red-400' :
    //                         'bg-gray-400' // Default color
    //         }`}>{row.Status}</span>,
    //     sortable: true
    // },

    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <div className="flex p-1">
    //       <button onClick={() => handlePrint(row)} className='bg-blue-300 p-2 rounded-sm mr-1' title='Print'><span><FaPrint /></span></button>
    //                         <button onClick={() => handleMail(row)} className='bg-green-500 p-2 rounded-sm' title='Mail'><IoMailOutline /></button>
    //       <button
    //         onClick={() => handleEdit(row)}
    //         className="bg-yellow-300 p-2 rounded-sm mr-1"
    //         title="Edit"
    //       >
    //         <span>
    //           <FaEdit />
    //         </span>
    //       </button>

    //       <button
    //         onClick={() => handleDelete(row)}
    //         className="bg-red-500 p-2 rounded-sm"
    //         title="Delete"
    //       >
    //         <RiDeleteBin2Line />
    //       </button>
    //     </div>
    //   ),
    //   ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
    //   allowOverflow: true, // Ensure the buttons are visible
    //   button: true, // Makes it clear they are buttons
    // },
  ];

  return (
    <>
      <div className="w-full border-2 rounded-sm">
        <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
          Start Order
        </div>

        <div className="mx-4 mt-2 mb-2">
          <form onSubmit={handle_FormSubmit} autoComplete="off">
            {/* <div className="mb-2">
              <label htmlFor="serial_uid" className="label-style">
                Serial Number
              </label>
              <input
                type="text"
                id="serial_uid"
                name="serial_uid"
                value={startData.serial_uid}
                placeholder="Enter UID Number."
                autoComplete="off"
                className="input-style"
              />
            </div> */}

            <div className="grid grid-cols-2 gap-2">
              {/* <div className="mb-2">
                <label htmlFor="order_number" className="label-style">
                  Order Number
                </label>
                <input
                  type="text"
                  id="order_number"
                  name="order_number"
                  value={orderData.order_number}
                  onChange={handle_InputChange}
                  placeholder="Enter Order Number."
                  autoComplete="off"
                  className="input-style "
                  disabled
                />
              </div> */}

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
               styleCustom={"border border-yellow-400"}
               />
              </div>

              <div className="mb-2">
                <label htmlFor="order_number" className="label-style">
                  Order Qty
                </label>
                <input
                  type="text"
                  id="order_number"
                  name="order_number"
                  value={safeValue(startData.order_qty, 0)}
                  onChange={handle_InputChange}
                  placeholder="Enter Order Number."
                  autoComplete="off"
                  className="input-style "
                  disabled
                />
              </div>
            </div>

            <div className="mb-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="" className="label-style">
                    Select Bag
                  </label>
                  <Combobox
                    comboValue={bagComboValue}
                    setComboValue={setBagComboValue}
                    comboData={bagComboData}
                     styleCustom={"border border-purple-400"}
                  />
                </div>
                {/* <div>
                  <label htmlFor="bag_number" className="label-style">
                    Bag Number
                  </label>
                  <input
                    id="bag_number"
                    name="bag_number"
                    value={startData.bag_number}
                    onChange={handle_InputChange}
                    placeholder="Enter ItemCode."
                    autoComplete="off"
                    readOnly
                    className="input-style bg-gray-200"
                  />
                </div> */}

                <div>
                  <label htmlFor="start_qty" className="label-style">
                    Started Qty
                  </label>
                  <input
                    id="start_qty"
                    name="start_qty"
                    value={safeValue(startData.start_qty, 0)}
                    onChange={handle_InputChange}
                    placeholder="Enter ItemCode."
                    autoComplete="off"
                    readOnly
                    className="input-style bg-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* <div className="mb-2">
              <label htmlFor="description" className="label-style">
                Description
              </label>
              <input
                id="description"
                name="description"
                value={safeValue(startData.description, "")}
                onChange={handle_InputChange}
                placeholder="Enter Description."
                autoComplete="off"
                className="input-style"
              />
            </div> */}

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-2">
                <label htmlFor="to_startQty" className="label-style">
                  To Start (Qty)
                </label>
                <input
                  type="number"
                  inputMode="decimal" //  input mode for mobile optimization
                  min="0"
                  step="1"
                  id="to_startQty"
                  name="to_startQty"
                  value={safeValue(startData.to_startQty, 0)}
                  onChange={handle_InputChange}
                  placeholder="Enter Order Qty."
                  autoComplete="off"
                  className="input-style"
                />
              </div>
            </div>

            <button
              className={`${
                isEdit
                  ? "bg-yellow-400"
                  : "bg-pink-500 text-white  rounded-sm hover:bg-pink-400 "
              } w-1/2 px-2 py-1 rounded-sm`}
            >{`${isEdit ? "Update" : "Kit-Start"}`}</button>
          </form>
        </div>
        <div className="w-full border-2 rounded-sm">
          <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
            Print (Main Label)
          </div>
          <div className="m-2">
            {/* <div className="flex mb-4">
              <DateRangePicker />
            </div>
            <DataTableVIew
              key={apiData.length || "empty"}
              tbl_title={""}
              columns={columns}
              apiData={apiData}
            /> */}

            <DataTableCheckbox
              headerValue={headerValue}
              tableData={apiData}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </div>

          <div className="m-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 text-white px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-blue-500"
            >
              Print label
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
