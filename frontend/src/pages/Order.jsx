import React, { useEffect, useState } from "react";
import {
  Load_Order_Service,
  Load_BagNumber_Service,
  Save_Order_Service,
  Update_Order_Service,
  Delete_Order_Service,
} from "../services/Order_Service";
import { DateRangePicker } from "../components";
import { useDateRange } from "@/context/DateRangeContext";
import { StartOrder } from "../pages/StartOrder";
import {
  DataTableVIew,
  DatePickerModal,
  CalenderModel,
  Combobox,
  ComboboxDynamic
} from "../components";
import { parse, format } from "date-fns";
import { SweetAlert_Delete, DateFormat } from "../utils/custom";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

export const Order = () => {
  const { API_DateRange } = useDateRange();

  const order_InitialValue = {
    _id: "",
    order_number: "",
    order_date: "",
    bag_number: "",
    description: "",
    order_qty: 1,
    start_qty: 0,
    complete_qty: 0,
    pending_qty: 0,
    status: "Ordered",
    delivery_date: "",
    rate: 0,
  };

  const [orderData, setOrderData] = useState(order_InitialValue);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);

  const [orderDate, setOrderDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());

  const [comboValue, setComboValue] = useState("");
  const [comboData, setComboData] = useState([]);

  // console.log("Date :", date);
  // console.log("apiData :", apiData);
  // console.log("comboData :", comboData);
  // console.log("orderData :", orderData);

  const load_OrderData = async () => {
    try {
      const { startDate, endDate } = API_DateRange(); // get ISO strings
      setLoading(true);
      const result = await Load_Order_Service(startDate, endDate);

      if (result?.data?.success) {
        const fetchedData = result?.data?.data;
        // console.log("Load Data :", fetchedData);

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
      console.log("Error Load Order Data:", error);
      toast.error("Something went wrong while loading kits.");
    } finally {
      setLoading(false);
    }
  };

  // const load_BagNumbers = async () => {
  //   try {
  //     const result = await Load_BagNumber_Service();
  //     const fetchedData = result?.data?.data;

  //     // console.log("load_BagNumbers :", fetchedData);

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
    const fetch_BagComboData = async () => {
      try {
        // Small delay if needed
        await new Promise((resolve) => setTimeout(resolve, 100)); //300
  
        const result = await Load_BagNumber_Service();
        const fetchedData = result?.data?.data;
  
        // console.log("load_BagNumbers:", fetchedData);
  
        if (Array.isArray(fetchedData)) {
          setComboData(fetchedData);
        } else {
          console.warn("Expected an array, got:", fetchedData);
        }
      } catch (error) {
        console.log("Error Load Order Data:", error);
      }
    };

  useEffect(() => {
    load_OrderData();
  }, [API_DateRange]);

  // useEffect(() => {
  //   load_BagNumbers();
  // }, []);

  useEffect(() => {
    setOrderData((prev) => ({
      ...prev,
      order_date: format(orderDate, "yyyy-MM-dd"), // Sync Calendar Dates to orderData
      delivery_date: format(deliveryDate, "yyyy-MM-dd"),
      bag_number: comboValue, // Sync Combo Box to orderData
    }));
  }, [orderDate, deliveryDate, comboValue]);

  const handle_InputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["qty", "rate"];
    setOrderData((preve) => ({
      ...preve,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handle_FormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!isEdit) {
        // save function ...
        const result = await Save_Order_Service(orderData);
        console.log("result :", result);
        if (result?.data?.success) {
          toast.success("Save Success!");
        } else {
          toast.error("Save Fail!");
        }
      } else if (isEdit) {
        // update function ...

        const { _id } = orderData;

        if (_id == "") {
          toast.error("Edit Data 'ID' Missing !");
          return;
        }

        const result = await Update_Order_Service(orderData);
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
      setOrderData(order_InitialValue);
      setComboValue("");
      setOrderDate(new Date()); // ✅ Reset calendar date
      setDeliveryDate(new Date()); // ✅ Reset calendar date
      await load_OrderData();
    }
  };

  const handleEdit = async (row) => {
    setIsEdit(true);
    // setOrderData(row);

    // parse date's
    const parsedOrderDate = row.order_date
      ? parse(row.order_date, "dd-MM-yyyy", new Date())
      : new Date();
    const parsedDeliveryDate = row.delivery_date
      ? parse(row.delivery_date, "dd-MM-yyyy", new Date())
      : new Date();

    // update date state
    setOrderDate(parsedOrderDate);
    setDeliveryDate(parsedDeliveryDate);

    // update combo state
    setComboValue(row.bag_number || "");

    // update date to order state
    setOrderData({
      ...row,
      order_date: format(parsedOrderDate, "yyyy-MM-dd"),
      delivery_date: format(parsedDeliveryDate, "yyyy-MM-dd"),
      bag_number: comboValue,
    });
  };

  const handleDelete = async (row) => {
    const shouldDelete = await SweetAlert_Delete();
    if (shouldDelete) {
      const result = await Delete_Order_Service(row._id);
      if (result?.data?.success) {
        toast.success("Delete Success!");
        await load_OrderData();
      } else {
        toast.error("Delete Fail!");
      }
    }
  };

  // Define table columns
  const columns = [
    {
      name: "Order_No",
      selector: (row) => row.order_number,
      sortable: true,
    },
    {
      name: "Order_Date",
      selector: (row) => row.order_date,
      sortable: true,
    },
    {
      name: "Bag_No",
      selector: (row) => row.bag_number,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Order_Qty",
      selector: (row) => row.order_qty,
      sortable: true,
    },

    {
      name: "Start_Qty",
      selector: (row) => row.start_qty,
      sortable: true,
    },
    {
      name: "Delivery_Date",
      selector: (row) => row.delivery_date,
      sortable: true,
    },
    {
      name: "Rate",
      selector: (row) => row.rate,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
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
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex p-1">
          {/* <button onClick={() => handlePrint(row)} className='bg-blue-300 p-2 rounded-sm mr-1' title='Print'><span><FaPrint /></span></button>
                        <button onClick={() => handleMail(row)} className='bg-green-500 p-2 rounded-sm' title='Mail'><IoMailOutline /></button> */}
          <button
            onClick={() => handleEdit(row)}
            className="bg-yellow-300 p-2 rounded-sm mr-1"
            title="Edit"
          >
            <span>
              <FaEdit />
            </span>
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="bg-red-500 p-2 rounded-sm"
            title="Delete"
          >
            <RiDeleteBin2Line />
          </button>
        </div>
      ),
      ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
      allowOverflow: true, // Ensure the buttons are visible
      button: true, // Makes it clear they are buttons
    },
  ];

  return (
    <>
      <div className=" grid md:grid-cols-2 gap-8">
        <div className=" ">
          <div className="  border-2 rounded-sm">
            <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
              Order Entry
            </div>
            <div className="mx-4 mt-2 mb-2">
              <form onSubmit={handle_FormSubmit} autoComplete="off">
                <div className="grid grid-cols-2 gap-2">
                  <div className="mb-2">
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
                      className="input-style"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="order_date" className="label-style">
                      Order Date
                    </label>
                    {/* <input
                    type="text"
                    id="order_date"
                    name="order_date"
                    value={orderData.order_date}
                    onChange={handle_InputChange}
                    placeholder="Enter Order Date."
                    autoComplete="off"
                    className="input-style"
                  /> */}
                    <CalenderModel date={orderDate} setDate={setOrderDate} />
                  </div>
                </div>

                <div className="mb-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="" className="label-style">
                        Search : Bag Number
                      </label>
                      {/* <Combobox
                        comboValue={comboValue}
                        setComboValue={setComboValue}
                        comboData={comboData}
                      /> */}

                       <ComboboxDynamic
                            comboValue={comboValue}
                            setComboValue={setComboValue}
                            comboData={comboData}
                            fetchDataOnOpen={fetch_BagComboData} // 🔁 Pass the function as prop
                          />
                    </div>

                    {/* <div>
                      <label htmlFor="bag_number" className="label-style">
                        Bag Number
                      </label>
                      <input
                        id="bag_number"
                        name="bag_number"
                        value={orderData.bag_number}
                        onChange={handle_InputChange}
                        placeholder="Enter ItemCode."
                        autoComplete="off"
                        readOnly
                        className="input-style bg-gray-200"
                      />
                    </div> */}
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="description" className="label-style">
                    Description
                  </label>
                  <input
                    id="description"
                    name="description"
                    value={orderData.description}
                    onChange={handle_InputChange}
                    placeholder="Enter Description."
                    autoComplete="off"
                    className="input-style"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-2">
                    <label htmlFor="order_qty" className="label-style">
                      Order Qty
                    </label>
                    <input
                      type="number"
                      inputMode="decimal" //  input mode for mobile optimization
                      min="0"
                      step="1"
                      id="order_qty"
                      name="order_qty"
                      value={orderData.order_qty}
                      onChange={handle_InputChange}
                      placeholder="Enter Order Qty."
                      autoComplete="off"
                      className="input-style"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="delivery_date" className="label-style">
                      Delivery Date
                    </label>
                    {/* <input
                    type="text"
                    id="delivery_date"
                    name="delivery_date"
                    value={orderData.delivery_date}
                    onChange={handle_InputChange}
                    placeholder="Enter Delivery Date."
                    autoComplete="off"
                    className="input-style"
                  /> */}
                    <CalenderModel
                      date={deliveryDate}
                      setDate={setDeliveryDate}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="rate" className="label-style">
                    Rate / Kit
                  </label>
                  <input
                    type="number"
                    inputMode="decimal" //  input mode for mobile optimization
                    min="0"
                    step="1"
                    id="rate"
                    name="rate"
                    value={orderData.rate}
                    onChange={handle_InputChange}
                    placeholder="Enter Kit Rate."
                    autoComplete="off"
                    className="input-style"
                  />
                </div>

                <button
                  className={`${
                    isEdit
                      ? "bg-yellow-400"
                      : "bg-green-600 text-white  rounded-sm hover:bg-green-400 "
                  } w-full px-2 py-1 rounded-sm`}
                >{`${isEdit ? "Update" : "Save"}`}</button>
              </form>
            </div>
          </div>

          <div className="w-full border-2 rounded-sm">
            <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
              Report
            </div>
            <div className="m-2">
              <div className="flex mb-4">
                <DateRangePicker />
              </div>
              <DataTableVIew
                key={apiData.length || "empty"}
                tbl_title={""}
                columns={columns}
                apiData={apiData}
              />
            </div>
          </div>
        </div>

        <div>
          <StartOrder load_OrderData={load_OrderData} />
        </div>
      </div>
    </>
  );
};
