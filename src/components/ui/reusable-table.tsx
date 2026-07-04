import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Column<T> {
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  isHighlighted?: boolean;
}

interface ReusableTableProps<T> {
  data: T[] | undefined;
  columns: Column<T>[];
  rowKey: keyof T | ((row: T) => string | number);
  emptyMessage?: string;
  searchKeys?: (keyof T)[]; // Which keys to search through
}

export function ReusableTable<T>({
  data = [],
  columns,
  rowKey,
  emptyMessage = "No data available in table",
  searchKeys = [],
}: ReusableTableProps<T>) {
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getRowKey = (row: T): string | number => {
    if (typeof rowKey === "function") return rowKey(row);
    return row[rowKey] as unknown as string | number;
  };

  // 1. Filter data based on search bar query input
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchQuery.trim() || searchKeys.length === 0) return data;

    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        return val
          ? String(val).toLowerCase().includes(searchQuery.toLowerCase())
          : false;
      }),
    );
  }, [data, searchQuery, searchKeys]);

  // 2. Compute pagination metrics
  const totalEntries = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));

  // Reset page position safely if filter outranks count
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, startIndex, pageSize]);

  return (
    <div className="w-full text-sm font-sans text-gray-700 bg-white p-4 rounded-md shadow-sm">
      {/* Top Bar Actions & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3 mb-4">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm bg-gray-50 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <button className="hover:text-black transition">🖨️ Print</button>
            <button className="hover:text-black transition">📊 Excel</button>
            <button className="hover:text-black transition">📄 CSV</button>
            <button className="hover:text-black transition">📋 Copy</button>
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <span>Search:</span>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 font-normal"
              placeholder="Type to search..."
            />
          </div>
        </div>
      </div>

      {/* Main Table Interface Layout */}
      <div className="overflow-x-auto border rounded-md relative shadow-inner">
        <Table className="w-full min-w-max text-left border-collapse">
          <TableHeader className="bg-white border-b-2 border-gray-100">
            <TableRow className="hover:bg-transparent">
              {columns.map((col, idx) => {
                const headerStyle = col.isHighlighted
                  ? "bg-purple-50 text-purple-900 font-bold px-4 py-3 text-center border-x border-white"
                  : "text-purple-800 font-bold px-4 py-3";
                return (
                  <TableHead
                    key={idx}
                    className={`${headerStyle} ${col.className || ""}`}
                  >
                    {col.header}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={getRowKey(row)}
                  className={
                    rowIndex % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50/60 hover:bg-gray-50"
                  }
                >
                  {columns.map((col, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        col.isHighlighted ? "bg-purple-50/30 text-center" : ""
                      } ${col.className || ""}`}
                    >
                      {col.render
                        ? col.render(row, startIndex + rowIndex)
                        : col.accessor
                        ? (row[col.accessor] as React.ReactNode)
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 bg-gray-50/50 font-medium"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bottom Counter Bar and Numbered Pagination controls */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
        <div>
          Showing {totalEntries > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + pageSize, totalEntries)} of {totalEntries}{" "}
          entries
        </div>

        {/* Numbered Pagination Control Panel */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-7 px-2"
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-7 w-7 p-0 ${
                  currentPage === pageNumber
                    ? "bg-purple-700 hover:bg-purple-800 text-white"
                    : ""
                }`}
              >
                {pageNumber}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-7 px-2"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
