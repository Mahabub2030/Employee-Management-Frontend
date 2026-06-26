import type { ReactNode } from "react";
import { Search, RefreshCw, WifiOff, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T, index: number) => ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  filterValue?: string;
  onFilterChange?: (val: string) => void;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
  pageSize?: number;
  page: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  keyExtractor: (row: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  error,
  onRetry,
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  filterPlaceholder,
  pageSize = 6,
  page,
  onPageChange,
  totalCount,
  keyExtractor,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  const renderBody = () => {
    if (loading)
      return (
        <tr>
          <td colSpan={columns.length} className="py-16 text-center">
            <RefreshCw className="h-6 w-6 mx-auto mb-3 animate-spin text-muted-foreground" />
            <p className="text-sm font-medium">Loading…</p>
          </td>
        </tr>
      );

    if (error)
      return (
        <tr>
          <td colSpan={columns.length} className="py-16 text-center">
            <Database className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              Could not reach the server
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Check your connection or try again
            </p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
            </Button>
          </td>
        </tr>
      );

    if (data.length === 0)
      return (
        <tr>
          <td colSpan={columns.length} className="py-16 text-center">
            <WifiOff className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">No results found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </td>
        </tr>
      );

    // ✅ FIXED: added index to map and render
    return data.map((row, index) => (
      <tr
        key={keyExtractor(row)}
        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
      >
        {columns.map((col) => (
          <td key={String(col.key)} className="px-4 py-3 text-sm">
            {col.render
              ? col.render(row, index)
              : String((row as any)[col.key] ?? "")}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search…"
            value={searchValue}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onPageChange(1);
            }}
            className="pl-9"
          />
        </div>
        {onFilterChange && filterOptions && (
          <Select
            value={filterValue}
            onValueChange={(v) => {
              onFilterChange(v);
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={filterPlaceholder || "Filter"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{filterPlaceholder || "All"}</SelectItem>
              {filterOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="text-left px-4 py-3 font-medium text-muted-foreground"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{renderBody()}</tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && totalCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {start}–{end} of {totalCount} results
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(i + 1)}
                  className="w-8 h-8 p-0"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
