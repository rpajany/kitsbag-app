import React, { useState, useEffect } from "react";
import { useDateRange } from "@/context/DateRangeContext";
import { DataTableVIew, DateRangePicker } from "../components";
import { Load_Order_Service } from "../services/Order_Service";
import { toast } from "react-toastify";

export const OrderReport = () => {
  const { API_DateRange } = useDateRange();

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    load_OrderData();
  }, [API_DateRange]);

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
      name: "Complete_qty",
      selector: (row) => row.complete_qty,
      sortable: true,
    },
    {
      name: "Pending_qty",
      selector: (row) => row.pending_qty,
      sortable: true,
    },
    {
      name: "Delivery_Date",
      selector: (row) => row.delivery_date,
      sortable: true,
    },

    {
      name: "Status",
      // selector: row => <span onClick={() => handleStatusClick(row)} className={`p-4  rounded-full text-white  font-extralight hover:cursor-pointer ${row.Status === 'CLOSED' ? 'bg-green-400' :
      selector: (row) => (
        <span
          className={`px-4 py-2 rounded-full text-white  text-center    hover:cursor-pointer ${
            row.status === "Complete"
              ? "bg-green-400"
              : // row.Status === 'PENDING' ? 'bg-blue-400' :
              //     row.Status === 'REJECTED' ? 'bg-orange-400' :
              row.Status === "Start"
              ? "bg-yellow-400"
              : // row.Status === 'OPEN' ? 'bg-red-400' :
                "bg-gray-400" // Default color
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },

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
          Order Report
        </div>
        <div className="m-2">
          <div className="flex mb-4">
            <DateRangePicker />
          </div>
          <DataTableVIew
            key={apiData.length || "empty"}
            tbl_title={"Order_Report"}
            columns={columns}
            apiData={apiData}
          />
        </div>
      </div>
    </>
  );
};
