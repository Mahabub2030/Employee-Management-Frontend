import React, { useState } from "react";
import {
  Search,
  Printer,
  FileSpreadsheet,
  FileText,
  Copy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Column<T> {
  header: string;
  // Allows string keys or a custom rendering function for badges, buttons, etc.
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T; // Simple primitive key to filter on
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKey,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter Data
  const filteredData = data.filter((row) => {
    if (!searchTerm || !searchKey) return true;
    const value = row[searchKey];
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 2. Paginate Data
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const currentData = filteredData.slice(startIndex, endIndex);

  // Action Bar Handlers (Mocks for export buttons)
  const handleAction = (actionType: string) => {
    console.log(`Triggered ${actionType} export for current dataset.`);
    // Implement your export logics here if required
  };

  return (
    <div className="w-full space-y-4 bg-card rounded-xl border border-border p-4 shadow-sm">
      {/* --- Action & Search Controls Top Bar --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
        {/* Left Side: Page Size Selector */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span>Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>

        {/* Right Side: Quick Action Exports & Search bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 ml-auto sm:ml-0">
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium border-r pr-4 border-border hidden md:flex">
            <button
              onClick={() => handleAction("print")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              onClick={() => handleAction("excel")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
            <button
              onClick={() => handleAction("csv")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <FileText className="h-4 w-4" /> CSV
            </button>
            <button
              onClick={() => handleAction("copy")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Copy className="h-4 w-4" /> Copy
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>
        </div>
      </div>

      {/* --- Styled Custom Scrollable Table Content --- */}
      <div className="rounded-lg border border-border bg-muted/5 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`p-3 text-xs font-semibold tracking-wider text-purple-800 uppercase bg-purple-50/40 dark:bg-purple-950/20 whitespace-nowrap ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-border hover:bg-muted/30 transition-colors last:border-0"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`p-3 text-sm font-medium text-foreground/90 whitespace-nowrap ${
                        col.className || ""
                      }`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : row[col.accessor] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-sm text-muted-foreground"
                >
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Footer Pagination Controls --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 text-xs text-muted-foreground font-medium">
        <div>
          Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center px-3 h-7 rounded border border-input bg-background font-semibold text-foreground min-w-[28px]">
            {currentPage}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
