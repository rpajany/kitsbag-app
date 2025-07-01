import React, { useState } from "react";
import {
  DataTableVIew,
  CalenderModel,
  ComboboxDynamic,
  DataTableCheckbox,
} from "../components";
import { Button } from "@/components/ui/button";
import { Weight, PrinterCheck, SquareMousePointer } from "lucide-react";

export const MultiKit = ({ order_number, bag_number }) => {
  const [tableData, setTableData] = useState([]);
  const [headerValue, setHeaderValue] = useState([
    "Bag_Number",
    "Part_Number",
    "Description",
    "Qty",
  ]); // []

  return (
    <>
      <div className="w-full   border-2 rounded-sm">
        <div className="bg-violet-400 text-white px-5 py-1 rounded-t-sm">
          Multi Kit
        </div>
        <div className="w-full   rounded-sm mt-4 ">
          <DataTableCheckbox headerValue={headerValue} tableData={tableData} />
        </div>
        <div className="mt-2 p-2 flex justify-between ">
          <Button variant="default" size="sm">
            <SquareMousePointer className="w-24 h-24" /> Select Kit
          </Button>
{/* 
          <Button variant="outline" className="bg-green-400 ">
            <FileDown />
            Export
          </Button> */}
        </div>
      </div>
    </>
  );
};
