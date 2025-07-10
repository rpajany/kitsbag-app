import React, { useState, useEffect } from "react";
import {
  DateRangePicker,
  DataTableVIew,
  MultiAutoComplete,
  RadioGroupModel,
} from "../components";
import {
  Load_BinStock_Service,
  Load_AutoComplete_Service,
  Save_BinStock_Service,
  Update_BinStock_Service,
  Delete_BinStock_Service,
} from "../services/BinStock_Service";
import { SweetAlert_Delete } from "../utils/custom";
import { useDateRange } from "@/context/DateRangeContext";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

export const BinStock = () => {
  const { API_DateRange } = useDateRange();

  const binStock_InitialValue = {
    _id: "",
    part_number: "",
    description: "",
    part_level: "",
    location: "",
    bin_number: "",
    stock_qty: 0,
    transact_qty: 0,
    updated_stock: 0,
    stock_action: "",
    employee: "",
  };

  const [binStockData, setBinStockData] = useState(binStock_InitialValue);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]); // for selected row item in part search autocomplete

  const [radioValue, setRadioValue] = useState("");

  // console.log("selectedRow :", selectedRow);
  console.log("binStockData :", binStockData);
  // console.log("radioValue :", radioValue);

  const load_Data = async () => {
    try {
      const { startDate, endDate } = API_DateRange(); // get ISO strings
      setLoading(true);
      const result = await Load_BinStock_Service(startDate, endDate);

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

  const load_AutoCompleteData = async () => {
    try {
      setAutoCompleteData([]);
      setLoading(true);

      const result = await Load_AutoComplete_Service();

      if (result?.data?.success) {
        const fetchedData = result?.data?.data;
        // console.log("Load Data :", fetchedData);

        if (Array.isArray(fetchedData) && fetchedData.length >= 1) {
          setAutoCompleteData([...fetchedData]); // force new reference even if empty
        } else if (fetchedData.length === 0) {
          // console.warn("Expected an array, got:", fetchedData);
          console.log("Setting empty data: []");
          setAutoCompleteData([]);
        }
      } else if (result.error) {
        toast.error(result.message); // or use dialog, alert, etc.
      }
    } catch (error) {
      console.log("Error load_AutoCompleteData :", error);
      toast.error("Something went wrong while loading kits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load_Data();
  }, [API_DateRange]);

  useEffect(() => {
    if (selectedRow) {
      setBinStockData((prev) => ({
        ...prev,
        ...selectedRow,
      }));
    }

    var stock_updated = 0;

    if (radioValue !== "") {
      const old_stock = parseFloat(binStockData.stock_qty);
      const tran_qty = parseFloat(binStockData.transact_qty);

      if (binStockData.stock_action == "Add-Stock") {
        stock_updated = old_stock + tran_qty;
      } else if (binStockData.stock_action == "Minus-Stock") {
        if (old_stock <= 0) {
          // toast.warning("Stock Minus");
          stock_updated = 0;
        } else {
          stock_updated = old_stock - tran_qty;
        }
      }

      setBinStockData((prev) => ({
        ...prev,
        updated_stock: parseFloat(stock_updated),
        stock_action: radioValue,
      }));
    } else {
      setBinStockData((prev) => ({
        ...prev,
        updated_stock: 0,
        stock_action: radioValue,
      }));
    }
  }, [
    selectedRow,
    radioValue,
    binStockData.stock_action,
    binStockData.transact_qty,
  ]);

  const handle_InputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["transact_qty"];
    setBinStockData((preve) => ({
      ...preve,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handle_FormSubmit = async (e) => {
    e.preventDefault();
    try {
      // const old_stock = parseFloat(binStockData.stock_qty);
      // const tran_qty = parseFloat(binStockData.transact_qty);
      // var updated_stock = 0;

      // if (binStockData.stock_action == "Add-Stock") {
      //   updated_stock = old_stock + tran_qty;
      // } else if (binStockData.stock_action == "Minus-Stock") {
      //   if (old_stock <= 0) {
      //     toast.warning("Stock Minus");
      //     return;
      //   } else {
      //     updated_stock = old_stock - tran_qty;
      //   }
      // }

      // console.log("updated_stock :", updated_stock);

      if (binStockData.stock_action == "") {
        toast.warning("Invalid Stock Action !");
        return;
      }

      if (binStockData.updated_stock == 0) {
        toast.warning("Invalid Stock Action / Transact Qty !");
        return;
      }

      if (binStockData.transact_qty <= 0) {
        toast.warning("Invalid Transact Qty !");
        return;
      }

      setLoading(true);
      if (!isEdit) {
        // save function ...
        const result = await Save_BinStock_Service(binStockData);
        console.log("result :", result);
        if (result?.data?.success) {
          toast.success("Save Success!");
        } else {
          toast.error("Save Fail!");
        }
      } else if (isEdit) {
        // update function ...
        const { _id } = binStockData;

        if (_id == "") {
          toast.error("Edit Data 'ID' Missing !");
          return;
        }

        const result = await Update_BinStock_Service(binStockData);
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
      setRadioValue("");
      setSelectedRow([]);
      setBinStockData(binStock_InitialValue);

      await load_Data();
    }
  };

  const handle_AutoComplete_Click = async () => {
    try {
      const result = await load_AutoCompleteData();
      console.log("result :", result);
    } catch (error) {
      console.log("Error handle_AutoComplete_Click :", error);
    }
  };

  // const handleEdit = async (row) => {
  //   setIsEdit(true);
  //   setBinStockData(row);
  // };

  const handleDelete = async (row) => {
    console.log("Delete Row :", row);

    5;
    const shouldDelete = await SweetAlert_Delete();
    if (shouldDelete) {
      const result = await Delete_BinStock_Service(row);
      if (result?.data?.success) {
        toast.success("Delete Success!");
        await load_Data();
      } else {
        toast.error("Delete Fail!");
      }
    }
  };

  // Define table columns
  const columns = [
    {
      name: "Part_Number",
      selector: (row) => row.part_number,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      cell: (row) => (
        <div
          title={row.description}
          style={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          {row.description}
        </div>
      ),
      sortable: true,
    },

    {
      name: "Transact_Date",
      selector: (row) => row.transact_date,
      cell: (row) => (
        <div
          title={row.transact_date}
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          {row.transact_date}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Stock_Qty",
      selector: (row) => row.stock_qty,
      sortable: true,
      //  style:{
      //   maxWidth:"100px"
      // }
    },
    {
      name: "Transact_Qty",
      selector: (row) => row.transact_qty,
      sortable: true,
      //  style:{
      //   maxWidth:"50px"
      // }
    },
    {
      name: "Hand_Qty",
      selector: (row) => row.hand_qty,
      sortable: true,
      //  style:{
      //   maxWidth:"100px",
      //   textAlign:"center",

      // }
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks,
       cell: (row) => (
        <div
          title={row.remarks}
          style={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          {row.remarks}
        </div>
      ),

      sortable: true,
    },
    {
      name: "Employee",
      selector: (row) => row.employee,
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
                          <button onClick={() => handleMail(row)} className='bg-green-500 p-2 rounded-sm' title='Mail'><IoMailOutline /></button>
          <button
            onClick={() => handleEdit(row)}
            className="bg-yellow-300 p-2 rounded-sm mr-1"
            title="Edit"
          >
            <span>
              <FaEdit />
            </span>
          </button> */}

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
      <div className="w-full border-2 rounded-sm">
        <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
          Bin Stock
        </div>

        <form onSubmit={handle_FormSubmit} autoComplete="off">
          <div className=" p-2">
            <div className="   mb-4">
              <label htmlFor="part_number" className="label-style">
                Search Child Part
              </label>
              <MultiAutoComplete
                handle_AutoComplete_Click={handle_AutoComplete_Click}
                autoCompleteData={autoCompleteData}
                inputName={""}
                txt_css={"input-style"}
                setRowItems={setSelectedRow}
                dropdownKeys={["part_number", "description"]}
                  styleCustom="border border-blue-400"
              />
            </div>
            <hr></hr>

            <div className="w-full grid grid-cols-2 gap-8 mt-2 mb-2">
              <div className="  mb-2">
                <label htmlFor="part_number" className="label-style">
                  Part Number
                </label>
                <input
                  type="text"
                  id="part_number"
                  name="part_number"
                  value={binStockData.part_number}
                  onChange={handle_InputChange}
                  readOnly
                  placeholder="Enter Part Number."
                  autoComplete="off"
                  className="input-style bg-gray-200 cursor-not-allowed"
                />
              </div>

              <div className="w-full mb-2">
                <label htmlFor="description" className="label-style">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={binStockData.description}
                  onChange={handle_InputChange}
                  readOnly
                  placeholder="Enter Description."
                  autoComplete="off"
                  className="input-style bg-gray-200 cursor-not-allowed"
                />
              </div>
            </div>

            <div className=" w-1/2 grid grid-cols-3 gap-8 mb-2">
              <div className=" mb-2">
                <label htmlFor="stock_qty" className="label-style">
                  StockQty
                </label>
                <input
                  type="number"
                  id="stock_qty"
                  name="stock_qty"
                  value={binStockData.stock_qty}
                  onChange={handle_InputChange}
                  readOnly
                  placeholder="Enter Part Number."
                  autoComplete="off"
                  className="rounded-sm px-2 py-1 w-full border bg-gray-200 border-green-500 cursor-not-allowed"
                />
              </div>

              <div className=" mb-2">
                <label htmlFor="location" className="label-style">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={binStockData.location}
                  onChange={handle_InputChange}
                  placeholder="Enter Part Number."
                  autoComplete="off"
                  className="input-style"
                />
              </div>

              <div className="  mb-2">
                <label htmlFor="bin_number" className="label-style">
                  Bin_Number
                </label>
                <input
                  type="text"
                  id="bin_number"
                  name="bin_number"
                  value={binStockData.bin_number}
                  onChange={handle_InputChange}
                  placeholder="Enter Bin No."
                  autoComplete="off"
                  className="input-style"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="w-1/2">
                  <label htmlFor="transact_qty" className="label-style">
                    Transact Qty
                  </label>
                  <input
                    type="number"
                    id="transact_qty"
                    name="transact_qty"
                    min={1}
                    value={binStockData.transact_qty}
                    onChange={handle_InputChange}
                    required
                    placeholder="Enter Stock Qty."
                    autoComplete="off"
                    className="rounded-sm px-2 py-1 w-full border border-yellow-500"
                  />
                </div>

                <div className="w-1/2">
                  <label htmlFor="employee" className="label-style">
                    Employee
                  </label>
                  <input
                    type="text"
                    id="employee"
                    name="employee"
                    value={binStockData.employee}
                    onChange={handle_InputChange}
                    required
                    placeholder="Enter Employee Details."
                    autoComplete="off"
                    className="input-style"
                  />
                </div>
              </div>

              <div className=" w-1/2 border border-violet-500  rounded-sm">
                <p className="bg-violet-500 px-2 text-white">Stock Action</p>
                <div className="p-4">
                  <RadioGroupModel
                    radioValue={radioValue}
                    setRadioValue={setRadioValue}
                    radioData={["Add-Stock", "Minus-Stock"]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-2 mt-2">
            <button
              className={`${
                isEdit
                  ? "bg-yellow-400"
                  : "bg-green-600 text-white  rounded-sm hover:bg-green-400 "
              } w-1/2 px-2 py-1 rounded-sm `}
            >{`${isEdit ? "Update" : "Save"}`}</button>
          </div>
        </form>

        <div className="mt-4">
          <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm mb-2">
            View Report
          </div>
          <div className="m-2">
            <div className="flex mb-4">
              <DateRangePicker />
            </div>
            <div className=" ">
              <DataTableVIew
                key={apiData.length || "empty"}
                tbl_title={""}
                columns={columns}
                apiData={apiData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
