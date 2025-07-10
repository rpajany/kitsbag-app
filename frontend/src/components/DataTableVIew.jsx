import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaEdit } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

//  , setRowEditData, setIsDelete, SetRowDeleteID
export const DataTableVIew = ({ tbl_title, columns, apiData }) => {
  const [data, setData] = useState([]); //[]

  // Handle Edit button click
  // const handleEdit = (row) => {
  //     setRowEditData(row);
  //     console.log('Edit button clicked for:', row);
  // };

  // Handle Delete button click
  // const handleDelete = (rowId) => {
  //     SetRowDeleteID(rowId)
  //     setIsDelete(true);

  // };

  // Handle Export to Excel
  const handleExport = () => {
    // Create a new workbook and a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheetData = data.map(({ id, ...rest }) => rest); // Exclude 'id' if not needed
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate a buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the buffer
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    try {
      // Save the file using FileSaver
      saveAs(dataBlob, "Report.xlsx");
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  useEffect(() => {
    // if (JSON.stringify(apiData) !== JSON.stringify(data)) { // Only update if apiData has changed
    //     setData(apiData);
    // }

    if (apiData.length > 0) {
      setData(apiData);
    }
  }, [apiData]); // Only re-run if apiData or local data changes / [data, apiData]

  const handleChange = (e) => {
    let searchQuery = e.target.value;

    if (searchQuery) {
      // const filterData = data.filter((item) => item.Description.toLowerCase().includes(searchQuery.toLowerCase()));
      const filterData = data.filter((row) => {
        // Check if any value in the row contains the search query
        return Object.values(row).some(
          (value) =>
            (typeof value === "string" &&
              value.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (typeof value === "number" &&
              value.toString().includes(searchQuery))
        );
      });

      console.log("filterData", filterData);
      setData(filterData);
    } else {
      setData(apiData);
    }
  };

  // Custom styles for the DataTable
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#4b4444de", // Set header background color to black
        color: "white", // Set header text color to white
        whiteSpace: "break-spaces",
        wordBreak: "break-word",
      },
    },
    cells: {
      style: {
        whiteSpace: "break-spaces", // ✅ allow wrapping - normal
        wordBreak: "break-word", // ✅ break long strings
        // overflow: "visible", // ✅ allow content to grow
        // textOverflow: "unset", // ✅ no ellipsis
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
  };

  return (
    <div className="w-full  border border-blue-400 overflow-x-auto overflow-y-auto">
      <div className="flex  m-3 space-x-3 ">
        <div>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              onChange={handleChange}
              id="default-search"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search.."
            />
          </div>
        </div>
        {/* <input type='text' onChange={handleChange} className=' border-2 rounded border-gray-600' placeholder='Search..' /> */}
        <button
          onClick={handleExport}
          className="bg-green-600  text-white px-2 py-1 rounded flex items-center "
        >
          <FaDownload className="mr-1" /> Excel
        </button>
      </div>
      <div className="w-full overflow-auto max-h-[600px]">
        <DataTable
          title={tbl_title}
          columns={columns}
          data={data}
          pagination
          customStyles={customStyles} // Apply custom styles to the table header
        />
      </div>
    </div>
  );
};
