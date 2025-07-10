import React, { useState, useEffect } from "react";
import { DateRangePicker, DataTableVIew } from "../components";
import {
  Load_ChildMaster_Service,
  Save_ChildMaster_Service,
  Update_ChildMaster_Service,
  Delete_ChildMaster_Service,
} from "../services/ChildMaster_Service";
import { SweetAlert_Delete } from "../utils/custom";
import { useDateRange } from "@/context/DateRangeContext";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

export const ChildMaster = () => {
  const { API_DateRange } = useDateRange();

  const childMaster_InitialValue = {
    _id: "",
    part_number: "",
    description: "",
    part_level: "M",
    location: "",
    bin_number: "",
  };

  const [childMasterData, setChildMasterData] = useState(
    childMaster_InitialValue
  );
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);

  const load_Data = async () => {
    try {
      const { startDate, endDate } = API_DateRange(); // get ISO strings
      setLoading(true);
      const result = await Load_ChildMaster_Service(startDate, endDate);

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

  useEffect(() => {
    load_Data();
  }, [API_DateRange]);

  const handle_InputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [];
    setChildMasterData((preve) => ({
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
        const result = await Save_ChildMaster_Service(childMasterData);
        console.log("result :", result);
        if (result?.data?.success) {
          toast.success("Save Success!");
        } else {
          toast.error("Save Fail!");
        }
      } else if (isEdit) {
        // update function ...
        const { _id } = childMasterData;

        if (_id == "") {
          toast.error("Edit Data 'ID' Missing !");
          return;
        }

        const result = await Update_ChildMaster_Service(childMasterData);
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
      setChildMasterData(childMaster_InitialValue);
      await load_Data();
    }
  };

  const handleEdit = async (row) => {
    setIsEdit(true);
    setChildMasterData(row);
  };

  const handleDelete = async (row) => {
    const shouldDelete = await SweetAlert_Delete();
    if (shouldDelete) {
      const result = await Delete_ChildMaster_Service(row._id);
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
      name: "location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "bin_number",
      selector: (row) => row.bin_number,
      sortable: true,
    },
    {
      name: "stock_Qty",
      selector: (row) => row.stock_qty,
      sortable: true,
    },
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
      <div className="w-full border-2 rounded-sm">
        <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
          Child master
        </div>

        <form onSubmit={handle_FormSubmit} autoComplete="off">
          <div className=" p-2">
            <div className="w-full grid grid-cols-2 gap-8">
              <div className="w-1/2  mb-2">
                <label htmlFor="part_number" className="label-style">
                  Part Number
                </label>
                <input
                  type="text"
                  id="part_number"
                  name="part_number"
                  value={childMasterData.part_number}
                  onChange={handle_InputChange}
                  placeholder="Enter Part Number."
                  autoComplete="off"
                  className="input-style"
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
                  value={childMasterData.description}
                  onChange={handle_InputChange}
                  placeholder="Enter Description."
                  autoComplete="off"
                  className="input-style"
                />
              </div>
            </div>

            <div className="  grid grid-cols-2 gap-8">
              <div className=" w-1/2 mb-2">
                <label htmlFor="location" className="label-style">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={childMasterData.location}
                  onChange={handle_InputChange}
                  placeholder="Enter Part Number."
                  autoComplete="off"
                  className="input-style"
                />
              </div>

              <div className=" w-1/2 mb-2">
                <label htmlFor="bin_number" className="label-style">
                  Bin_Number
                </label>
                <input
                  type="text"
                  id="bin_number"
                  name="bin_number"
                  value={childMasterData.bin_number}
                  onChange={handle_InputChange}
                  placeholder="Enter Bin No."
                  autoComplete="off"
                  className="input-style"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-2">
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
