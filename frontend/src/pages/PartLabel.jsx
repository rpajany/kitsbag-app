import React, { useEffect, useState } from "react";
import {
  Load_Order_Service,
  Load_BagNumber_Service,
  Load_ChildKits_Service,
  Save_Order_Service,
  Update_Order_Service,
  Delete_Order_Service,
} from "../services/PartLabel_Service";
import {
  DataTableVIew,
  CalenderModel,
  Combobox,
  ComboboxDynamic,
  DataTableCheckbox,
  DataTableFull,
} from "../components";

import { useZebraPrinter } from "../services/BrowserPrint_Service";
import { format } from "date-fns";
import { SweetAlert_Delete } from "../utils/custom";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

export const PartLabel = () => {
  // const sampleData = [
  //   { id: 1, name: "John Doe", email: "john@example.com" },
  //   { id: 2, name: "Jane Smith", email: "jane@example.com" },
  //   { id: 3, name: "Michael Johnson", email: "mike@example.com" },
  // ];

  const part_InitialValue = {
    _id: "",
    order_number: "",
    order_date: "",
    bag_number: "",
    // description: "",
    order_qty: 1,
    delivery_date: "",
    rate: 0,
  };
  const [partData, setPartData] = useState(part_InitialValue);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);

  const [orderDate, setOrderDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());

  const [comboValue, setComboValue] = useState("");
  const [comboData, setComboData] = useState([]);

  const [headerValue, setHeaderValue] = useState([
    "Bag_Number",
    "Part_Number",
    "Description",
    "Qty",
  ]); // []
  const [tableData, setTableData] = useState([]); // [] sampleData
  const [selectedRows, setSelectedRows] = useState([]); // table row select

  const { printZPL } = useZebraPrinter();

  // console.log("Date :", date);
  // console.log("apiData :", apiData);
  // console.log("comboData :", comboData);
  console.log("partData :", partData);
  console.log("tableData :", tableData);

  const load_Data = async () => {
    try {
      const result = await Load_Order_Service();
      const fetchedData = result?.data?.data;

      console.log("Load Data :", fetchedData);

      if (Array.isArray(fetchedData)) {
        setApiData(fetchedData);
      } else {
        console.warn("Expected an array, got:", fetchedData);
      }
    } catch (error) {
      console.log("Error Load Order Data:", error);
    }
  };

  // const load_ComboBag = async () => {
  //   try {
  //     const result = await Load_BagNumber_Service();
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

  const load_Bag_PartKits = async (comboValue) => {
    try {
      if (comboValue !== "") {
        const result = await Load_ChildKits_Service(comboValue);
        const fetchedData = result?.data?.data;

        console.log("load_PartKits :", fetchedData);

        if (Array.isArray(fetchedData)) {
          setTableData(fetchedData);
        } else {
          console.warn("Expected an array, got:", fetchedData);
          setTableData([]);
        }
      }
    } catch (error) {
      console.log("Error load_Bag_PartKits :", error);
    }
  };

  useEffect(() => {
    load_Data();
    // load_ComboBag();
  }, []);

  useEffect(() => {
    setPartData((prev) => ({
      ...prev,

      bag_number: comboValue, // Sync Combo Box to orderData
    }));

    load_Bag_PartKits(comboValue); // call PartKits API on comboValue change
  }, [comboValue]);

  // print zpl function ...
  const handlePrint = (e) => {
    e.preventDefault();
    console.log("clicked !!");

    if (selectedRows.length <= 0) {
      toast.info("No print row Selected !");
      return;
    }

    // const zpl_Data = `^XA^FO50,50^ADN,36,20^FDHello from React^FS^XZ`;

    // selectedRows.forEach((item) => {
    //   const print_Speed = 4;
    //   const print_Dark = 20;

    //   // Extracting dynamic values from item
    //   const item_partNumber = item.part_number;
    //   const item_description = item.description;
    //   const itemQty = item.qty || 1;
    //   const aDate = new Date().toLocaleDateString("en-GB").split("/").join("-"); // e.g., 01-07-2025

    //   // For barcode split: first 3 chars and the rest
    //   const i_code1 = item_partNumber.slice(0, 3).toUpperCase();
    //   const i_code2 = item_partNumber.slice(3).toUpperCase();

    //   // Build the ZPL lines
    //   const zplLines = [
    //     "CT~~CD,~CC^~CT~",
    //     `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR${print_Speed},${print_Speed}~SD${print_Dark}^JUS^LRN^CI0^XZ`,
    //     "^XA",
    //     "^MMT",
    //     "^PW480",
    //     "^LL0240",
    //     "^LS0",
    //     "^FO0,32^GFA,00768,00768,00012,:Z64:eJzt0DEOAiEQBdBPMKExwQOoXMHSDjsvZMIWJpBYeC08yCYcgXILwrgRcCm0sPdXL5+CmQF+z258jGO1pEC5c6oW5L/Y2alzrObkdDMjLM5Q4YORIX3rE1QzhqXHFeLtI7hzhadhxVEfwmG9eLPlrBl7sPIZi1DgZSA2QXe2EMV8thNlMZFgfbVMIC97l0PIDAqyHE4Ro6iq82zd9Zpe1nTrfKdoyTVPVGzM2VyMwT8/5Aka7mk0:DA29",
    //     "^FO9,16^GB459,221,4^FS",
    //     "^FO12,100^GB399,0,4^FS",
    //     "^FO91,17^GB0,87,3^FS",
    //     "^FO409,18^GB0,215,4^FS",
    //     `^FT105,45^A0N,16,16^FH\\^FDItem code : ${item_partNumber}^FS`,
    //     "^BY2,3,39^FT106,92^BCN,,N,N",
    //     `^FD>;${i_code1}>6${i_code2}^FS`,
    //     `^FT18,159^A0N,16,16^FH\\^FDQty: ${itemQty} No's^FS`,
    //     `^FT17,132^A0N,16,16^FH\\^FDDesc: ${item_description}^FS`,
    //     `^FT431,230^A0B,12,21^FH\\^FD${aDate}^FS`,
    //     `^FT33,85^A0N,11,12^FH\\^FDWITTUR^FS`,
    //     "^PQ1,0,1,Y^XZ",
    //     "",
    //   ];

    //   const zplData = zplLines.join("\n");

    //   printZPL(zplData);
    // });

    // Single ZPL Data Generation for All Rows :
    const print_Speed = 4;
    const print_Dark = 20;
    const aDate = new Date().toLocaleDateString("en-GB").split("/").join("-");

    let fullZplData = "";

    // Loop through each selected row and build the ZPL label
    selectedRows.forEach((item) => {
      const item_partNumber = item.part_number;
      const item_description = item.description;
      const itemQty = item.qty;

      const i_code1 = item_partNumber.slice(0, 3).toUpperCase();
      const i_code2 = item_partNumber.slice(3).toUpperCase();

      // 200 dpi label ......
      const zplLines = [
        "CT~~CD,~CC^~CT~",
        `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR${print_Speed},${print_Speed}~SD${print_Dark}^JUS^LRN^CI0^XZ`,
        "^XA",
        "^MMT",
        "^PW480",
        "^LL0240",
        "^LS0",
        "^FO0,32^GFA,00768,00768,00012,:Z64:eJzt0DEOAiEQBdBPMKExwQOoXMHSDjsvZMIWJpBYeC08yCYcgXILwrgRcCm0sPdXL5+CmQF+z258jGO1pEC5c6oW5L/Y2alzrObkdDMjLM5Q4YORIX3rE1QzhqXHFeLtI7hzhadhxVEfwmG9eLPlrBl7sPIZi1DgZSA2QXe2EMV8thNlMZFgfbVMIC97l0PIDAqyHE4Ro6iq82zd9Zpe1nTrfKdoyTVPVGzM2VyMwT8/5Aka7mk0:DA29",
        "^FO9,16^GB459,221,4^FS",
        "^FO12,100^GB399,0,4^FS",
        "^FO91,17^GB0,87,3^FS",
        "^FO409,18^GB0,215,4^FS",
        `^FT105,45^A0N,16,16^FH\\^FDItem code : ${item_partNumber}^FS`,
        "^BY2,3,39^FT106,92^BCN,,N,N",
        `^FD>;${i_code1}>6${i_code2}^FS`,
        `^FT18,159^A0N,16,16^FH\\^FDQty: ${itemQty} No's^FS`,
        `^FT17,132^A0N,16,16^FH\\^FDDesc: ${item_description}^FS`,
        `^FT431,230^A0B,12,21^FH\\^FD${aDate}^FS`,
        `^FT33,85^A0N,11,12^FH\\^FDWITTUR^FS`,
        "^PQ1,0,1,Y^XZ",
        "",
      ];

      fullZplData += zplLines.join("\n") + "\n";
    });

    // Send to printer
    printZPL(fullZplData);
  };

  const handle_InputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["qty"];
    setPartData((preve) => ({
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
        const result = await Save_Order_Service(partData);
        console.log("result :", result);
        if (result?.data?.success) {
          toast.success("Save Success!");
        } else {
          toast.error("Save Fail!");
        }
      } else if (isEdit) {
        // update function ...

        const { _id } = partData;

        if (_id == "") {
          toast.error("Edit Data 'ID' Missing !");
          return;
        }

        const result = await Update_Order_Service(partData);
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
      setPartData(part_InitialValue);
      setComboValue("");
      await load_Data();
    }
  };

  const handleEdit = async (row) => {
    setIsEdit(true);
    setPartData(row);
  };

  const handleDelete = async (row) => {
    const shouldDelete = await SweetAlert_Delete();
    if (shouldDelete) {
      const result = await Delete_Order_Service(row._id);
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
      name: "Delivery_Date",
      selector: (row) => row.delivery_date,
      sortable: true,
    },
    {
      name: "Rate",
      selector: (row) => row.rate,
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
      <div className=" ">
        <div className="w-full border-2 rounded-sm">
          <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
            Part label
          </div>
          <div className="mx-4 mt-2 mb-2">
            <form autoComplete="off">
              <div className="grid grid-cols-2 gap-2">
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

                    <div>
                      <label htmlFor="bag_number" className="label-style">
                        Bag Number
                      </label>
                      <input
                        id="bag_number"
                        name="bag_number"
                        value={partData.bag_number}
                        onChange={handle_InputChange}
                        placeholder="Enter BagNumber."
                        autoComplete="off"
                        readOnly
                        className="input-style bg-gray-200"
                      />
                    </div>
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
                  value={partData.description}
                  onChange={handle_InputChange}
                  placeholder="Enter Description."
                  autoComplete="off"
                  className="input-style"
                />
              </div> */}

              <div className=" flex w-full   ">
                <DataTableCheckbox
                  headerValue={headerValue}
                  tableData={tableData}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              </div>

              <div>
                <div className="w-40 mb-2 mt-4">
                  <label htmlFor="order_qty" className="label-style">
                    Print Qty
                  </label>
                  <input
                    type="number"
                    inputMode="decimal" //  input mode for mobile optimization
                    min="1"
                    step="1"
                    id="order_qty"
                    name="order_qty"
                    value={partData.order_qty}
                    onChange={handle_InputChange}
                    placeholder="Enter Order Qty."
                    autoComplete="off"
                    className="input-style"
                  />

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className={`${
                        isEdit
                          ? "bg-yellow-400"
                          : "bg-green-600 text-white  rounded-sm hover:bg-green-400 "
                      } w-full px-2 py-1 rounded-sm`}
                    >{`${isEdit ? "Update" : "Print"}`}</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4"></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
