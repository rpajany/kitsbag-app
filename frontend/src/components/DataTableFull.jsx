import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const columnHelper = createColumnHelper();

export const  DataTableFull = () => {
  const [serverData, setServerData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    const res = await fetch(
      `/api/data?page=${pageIndex}&size=${pageSize}&search=${globalFilter}`
    );
    const { data, total } = await res.json();
    setServerData(data);
    setTotalCount(total);
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, globalFilter]);

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="cursor-pointer flex items-center gap-1"
        >
          Name
          {column.getIsSorted() === "asc" && "⬆️"}
          {column.getIsSorted() === "desc" && "⬇️"}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="cursor-pointer flex items-center gap-1"
        >
          Email
          {column.getIsSorted() === "asc" && "⬆️"}
          {column.getIsSorted() === "desc" && "⬇️"}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data: serverData,
    columns,
    state: {
      rowSelection,
      sorting,
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    pageCount: Math.ceil(totalCount / pageSize),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex ?? pageIndex);
      setPageSize(next.pageSize ?? pageSize);
    },
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  const exportToExcel = (rows, filename = "export.xlsx") => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const blob = new Blob([buf], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  return (
    <div className="p-4 space-y-4">
      <Input
        placeholder="Search name or email..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : header.column.columnDef.header(
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.columnDef.cell(cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="text-sm text-muted-foreground">
          Page {pageIndex + 1} of {Math.ceil(totalCount / pageSize)}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => p + 1)}
            disabled={(pageIndex + 1) * pageSize >= totalCount}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={() => exportToExcel(selectedRows)}
          disabled={selectedRows.length === 0}
        >
          Export Selected to Excel
        </Button>
        <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
          {JSON.stringify(selectedRows, null, 2)}
        </pre>
      </div>
    </div>
  );
};

 
