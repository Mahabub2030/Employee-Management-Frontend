import { useState, useMemo } from "react";
import { useGetEmployeesQuery } from "@/redux/features/employee/employee.api";
import {
  DataTable,
  type Column,
  type FilterOption,
} from "@/components/DataTable";

// ── types ─────────────────────────────────────────────────────────────────────

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  salary: number;
  status: string;
  shift: string;
  avatar?: string;
  createdAt: string;
}

// ── constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

const statusOptions: FilterOption[] = [
  { label: "Active", value: "Active" },
  { label: "On Leave", value: "On Leave" },
  { label: "Terminated", value: "Terminated" },
];

const statusBadge: Record<string, string> = {
  Active: "bg-success/15 text-success",
  "On Leave": "bg-warning/15 text-warning",
  Terminated: "bg-destructive/15 text-destructive",
};

const shiftBadge: Record<string, string> = {
  Morning: "bg-info/15 text-info",
  Afternoon: "bg-warning/15 text-warning",
  Night: "bg-primary/15 text-primary",
};

// ── columns ───────────────────────────────────────────────────────────────────

const columns = (page: number, pageSize: number): Column<Employee>[] => [
  {
    key: "sr",
    label: "Sr",
    render: (_row: any, index: number) => (
      <span className="text-muted-foreground font-mono text-xs">
        {(page - 1) * pageSize + index + 1}
      </span>
    ),
  },
  {
    key: "name",
    label: "Employee",
    render: (emp) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary">
            {emp.avatar || emp.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-sm">{emp.name}</p>
          <p className="text-xs text-muted-foreground">{emp.email}</p>
        </div>
      </div>
    ),
  },
  { key: "department", label: "Department" },
  { key: "position", label: "Position" },
  {
    key: "salary",
    label: "Salary",
    render: (emp) => (
      <span className="font-mono">${Number(emp.salary).toLocaleString()}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (emp) => (
      <span
        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          statusBadge[emp.status] || ""
        }`}
      >
        {emp.status}
      </span>
    ),
  },
  {
    key: "shift",
    label: "Shift",
    render: (emp) => (
      <span
        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          shiftBadge[emp.shift] || ""
        }`}
      >
        {emp.shift}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Date Added",
    render: (emp) => (
      <span className="text-xs text-muted-foreground">
        {emp.createdAt
          ? new Date(emp.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </span>
    ),
  },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function ManageEmployee() {
  const { data, isLoading, isError, refetch } = useGetEmployeesQuery(undefined);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const employees: Employee[] = data?.data ?? data ?? [];

  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        const q = search.toLowerCase();
        const mq =
          e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
        const ms = statusFilter === "all" || e.status === statusFilter;
        return mq && ms;
      }),
    [employees, search, statusFilter],
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Employees</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {filtered.length} employees found
        </p>
      </div>

      <DataTable
        data={paginated}
        columns={columns(page, PAGE_SIZE)}
        loading={isLoading}
        error={isError}
        onRetry={refetch}
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
        filterPlaceholder="All status"
        pageSize={PAGE_SIZE}
        page={page}
        onPageChange={setPage}
        totalCount={filtered.length}
        keyExtractor={(e) => e._id}
      />
    </div>
  );
}
