import React, { useEffect, useState } from "react";
import { Load_BagNumber_Service } from "../services/Order_Service";
import {
  Load_ChildKit_Service,
  Save_ChildKit_Service,
  Update_ChildKit_Service,
  Delete_ChildKit_Service,
} from "../services/ChildKit_Service";
import { DateRangePicker } from "./DateRangePicker";
import { useDateRange } from "@/context/DateRangeContext";
import { DataTableVIew } from "./DataTableVIew";
import { Combobox } from "./Combobox";
import { SweetAlert_Delete } from "../utils/custom";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { ComboboxDynamic } from "./ComboboxDynamic";

export const ChildKit = () => {
  const { API_DateRange } = useDateRange();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comboValue, setComboValue] = useState("");
  const [comboData, setComboData] = useState([]);
  const [apiData, setApiData] = useState([]);

  const childKit_InitialValue = {
    _id: "",
    bag_number: comboValue ? comboValue : "",
    part_number: "",
    description: "",
    qty: 1,
    // min_weight: 0,
    // max_weight: 0,
    part_level: "S",
    parent_item_code: "",
    sub_assy: "",
  };
  const [childKitData, setChildKitData] = useState(childKit_InitialValue);

  const load_Data = async () => {
    try {
      const { startDate, endDate } = API_DateRange(); // get ISO strings
      setLoading(true);

      const result = await Load_ChildKit_Service(startDate, endDate);

      if (result?.data?.success) {
        const fetchedData = result?.data?.data;
        // console.log("Load Data :", fetchedData);

        if (Array.isArray(fetchedData) && fetchedData.length >= 1) {
          setApiData([...fetchedData]); // force new reference even if empty
        } else if (fetchedData.length === 0) {
          // console.warn("Expected an array, got:", fetchedData);
          // console.log("Setting empty data: []");
          setApiData([]);
        }
      } else if (result.error) {
        toast.error(result.message); // or use dialog, alert, etc.
      }
    } catch (error) {
      console.log("Error Load Childkit Data:", error);
      toast.error("Something went wrong while loading kits.");
    } finally {
      setLoading(false);
    }
  };

  // const load_BagNumbers = async () => {
  //     try {
  //       const result = await Load_BagNumber_Service();
  //       const fetchedData = result?.data?.data;

  //       // console.log("load_BagNumbers :", fetchedData);

  //       if (Array.isArray(fetchedData)) {
  //         setComboData(fetchedData);
  //       } else {
  //         console.warn("Expected an array, got:", fetchedData);
  //       }
  //     } catch (error) {
  //       console.log("Error Load Order Data:", error);
  //     }
  //   };

  useEffect(() => {
    load_Data();
  }, [API_DateRange]);

  // useEffect(() => {
  //   load_BagNumbers();
  // }, []);

  useEffect(() => {
    setChildKitData((prev) => ({
      ...prev,

      bag_number: comboValue, // Sync Combo Box to orderData
    }));
  }, [comboValue]);

  // console.log("apiData :", apiData);

  // This function will be triggered when Combobox opens
  const fetch_OrderComboData = async () => {
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

  const handle_InputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["qty"]; // , "min_weight", "max_weight"
    setChildKitData((preve) => ({
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
        const result = await Save_ChildKit_Service(childKitData);
        console.log("result :", result);
        if (result?.data?.success) {
          toast.success("Save Success!");
        } else {
          toast.error("Save Fail!");
        }
      } else if (isEdit) {
        // update function ...

        const { _id } = childKitData;

        if (_id == "") {
          toast.error("Edit Data 'ID' Missing !");
          return;
        }

        const result = await Update_ChildKit_Service(childKitData);
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
      setChildKitData(childKit_InitialValue);
      await load_Data();
    }
  };

  const handleEdit = async (row) => {
    setIsEdit(true);
    setChildKitData(row);
  };

  const handleDelete = async (row) => {
    try {
      const shouldDelete = await SweetAlert_Delete();
      if (shouldDelete) {
        const result = await Delete_ChildKit_Service(row._id);
        if (result?.data?.success) {
          toast.success("Delete Success!");
        } else {
          toast.error("Delete Fail!");
        }
      }
    } catch (error) {
      console.log("handleDelete Error :", error);
    } finally {
      await load_Data();
    }
  };

  // Define table columns
  const columns = [
    {
      name: "Bag_Number",
      selector: (row) => row.bag_number,
      sortable: true,
    },
    {
      name: "Part_Number",
      selector: (row) => row.part_number,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Qty",
      selector: (row) => row.qty,
      sortable: true,
    },
    // {
    //   name: "Min_Weight",
    //   selector: (row) => row.min_weight,
    //   sortable: true,
    // },
    // {
    //   name: "Max_Weight",
    //   selector: (row) => row.max_weight,
    //   sortable: true,
    // },
    {
      name: "Part_Level",
      selector: (row) => row.part_level,
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
      <div className="w-full border-2 rounded-t-sm">
        <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
          Add Child Kit
        </div>

        <div className="mx-4 mt-2 mb-2">
          <form onSubmit={handle_FormSubmit} autoComplete="off">
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
                  fetchDataOnOpen={fetch_OrderComboData} // 🔁 Pass the function as prop
                />
              </div>
              <div className="mb-2">
                <label htmlFor="bag_number" className="label-style">
                  Bag Number
                </label>
                <input
                  type="text"
                  id="bag_number"
                  name="bag_number"
                  value={childKitData.bag_number}
                  onChange={handle_InputChange}
                  placeholder="Enter Item Code."
                  autoComplete="off"
                  readOnly
                  className="input-style bg-gray-200"
                />
              </div>
            </div>

            <div className="mb-2">
              <label htmlFor="part_number" className="label-style">
                Part Number
              </label>
              <input
                type="text"
                id="part_number"
                name="part_number"
                value={childKitData.part_number}
                onChange={handle_InputChange}
                placeholder="Enter Part Number."
                autoComplete="off"
                className="input-style"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="description" className="label-style">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={childKitData.description}
                onChange={handle_InputChange}
                placeholder="Enter Description."
                autoComplete="off"
                className="input-style"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="qty" className="label-style">
                Qty
              </label>
              <input
                type="number"
                min="1"
                step="1"
                id="qty"
                name="qty"
                value={childKitData.qty}
                onChange={handle_InputChange}
                autoComplete="off"
                placeholder="Enter Kit qty."
                className="input-style w-1/2"
              />
            </div>

            {/* <div className=" grid md:grid-cols-2 gap-4"> 
              <div className="mb-2">
                <label htmlFor="min_weight" className="label-style">
                  Min Weight
                </label>
                <input
                  type="number"               
                  inputMode="decimal" 
                  min="0"
                  step="0.01"
                  id="min_weight"
                  name="min_weight"
                  value={childKitData.min_weight}
                  onChange={handle_InputChange}
                  placeholder="Enter Min Weight."
                  autoComplete="off"
                  className="input-style"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="max_weight" className="label-style">
                  Max Weight
                </label>
                <input
                  type="number"
                  inputMode="decimal" 
                  min="0"
                  step="0.01"
                  id="max_weight"
                  name="max_weight"
                  value={childKitData.max_weight}
                  onChange={handle_InputChange}
                  placeholder="Enter Max Weight."
                  autoComplete="off"
                  className="input-style"
                />
              </div>
            </div>*/}

            <button
              className={`${
                isEdit
                  ? "bg-yellow-400"
                  : "bg-green-600 text-white  rounded-sm hover:bg-green-400 "
              } w-full px-2 py-1 rounded-sm`}
            >{`${isEdit ? "Update" : "Save"}`}</button>
          </form>
        </div>
        <br></br>
        <div className="mt-2">
          <div className="bg-gray-400 text-black px-5 py-2 rounded-t-sm mb-2">
            View Report
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
    </>
  );
};
