import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export const DataTableCheckbox = ({ headerValue, tableData , selectedRows, setSelectedRows}) => {
  // const [selectedRows, setSelectedRows] = useState([]);

  const isRowSelected = (id) => selectedRows.some((row) => row._id === id);
  const allSelected = selectedRows.length === tableData.length;
  const partiallySelected = selectedRows.length > 0 && !allSelected;

  // const toggleRow = (rowId, checked) => {
  //   if (checked) {
  //     setSelectedRows((prev) => [...prev, rowId]);
  //   } else {
  //     setSelectedRows((prev) => prev.filter((id) => id !== rowId));
  //   }
  // };

  const toggleRow = (row, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, row]);
    } else {
      setSelectedRows((prev) => prev.filter((r) => r._id !== row._id));
    }
  };

  // const toggleSelectAll = (checked) => {

  //   if (checked) {
  //     setSelectedRows(tableData.map((row) => row._id));
  //   } else {
  //     setSelectedRows([]);
  //   }
  // };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows([...tableData]); // all full rows
    } else {
      setSelectedRows([]);
    }
  };

  console.log("selectedRows :", selectedRows);

  return (
    <>
      <div className=" h-50  border-2 rounded-sm overflow-x-auto overflow-y-auto">
        <Table className="border-collapse">
          <TableHeader className="bg-gray-300">
            <TableRow>
              <TableHead className="w-10 border-r pl-0 flex items-center justify-center  border-gray-300">
                <Checkbox
                  checked={allSelected}
                  indeterminate={partiallySelected}
                  onCheckedChange={(checked) => toggleSelectAll(checked)}
                  className="     border-gray-400"
                />
              </TableHead>
              {/* <TableHead>Name</TableHead>
              <TableHead>Email</TableHead> */}

              {headerValue.map((item) => (
                <TableHead key={item} className=" text-center border  border-gray-300">{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headerValue.length + 1}
               className="text-center py-4 border-r border border-gray-300"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((row) => (
                <TableRow key={row._id}>
                  <TableCell className="pl-0 flex items-center justify-center    border-r border-gray-400">
                    <Checkbox
                      checked={isRowSelected(row._id)}
                      onCheckedChange={(checked) => toggleRow(row, checked)}
                      className="  border   border-gray-400"
                    />
                  </TableCell>
                  {headerValue.map((item) => (
                    <TableCell key={`${row._id}-${item}`} className="  border-r border-gray-400">
                      {row[item.toLowerCase()]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Rows:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(selectedRows, null, 2)}
          </pre>
        </div> */}
      </div>
    </>
  );
};
