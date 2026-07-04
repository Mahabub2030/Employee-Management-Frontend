import { useGetEmployeesQuery } from "@/redux/features/employee/employee.api";
import { ReusableTable, Column } from "@/components/ui/reusable-table";

export enum EMPLOYEE_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export interface Employee {
  avatar?: string;
  created_by?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  phone: string;
  department: string;
  position: string;
  salary: number | string;
  shift: string;
  id: string | number;
  name: string;
  jobTitle: string;
  idNumber: string;
  employeeId: string | number;
  dacoId?: string;
  group: string;
  joiningDate: Date | string;
  nationality: string;
  companyName: string;
  status: EMPLOYEE_STATUS;
  remark?: string;
  SAPNumber?: string;
  email?: string;
  phoneNumber?: string;
  gender?: "male" | "female";
  workLocation?: string;
  images?: string[];
}

export default function ManageEmployee() {
  // Fetching live data via your RTK-Query slice
  const { data: employees } = useGetEmployeesQuery(undefined);

  // Administrative Handler Functions
  const handleEdit = (employee: Employee) => {
    console.log("Edit Employee:", employee.employeeId);
    // Add your routing logic or modal disclosure triggers here
  };

  const handleDelete = (employeeId: string | number) => {
    if (confirm("Are you sure you want to delete this employee record?")) {
      console.log("Delete Employee ID:", employeeId);
      // Trigger your deletion mutation hook here
    }
  };

  // Professional column mapping structured exactly like your spreadsheet workflow design
  const columns: Column<Employee>[] = [
    { header: "Emp ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Job Title", accessor: "jobTitle" },
    { header: "Iqama / ID Number", accessor: "idNumber" },
    { header: "DACO ID", render: (emp) => emp.dacoId || "—" },
    { header: "Group / Division", accessor: "group" },

    // Workflow Block Layout Examples matching the Purple Highlighted Styles from the UI
    { header: "2nd Approval", accessor: "companyName", isHighlighted: true },
    {
      header: "Status",
      render: (emp) => (
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
            emp.status === EMPLOYEE_STATUS.ACTIVE
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {emp.status}
        </span>
      ),
    },
    { header: "Remarks", render: (emp) => emp.remark || "—" },

    // --- Added: Professional Admin Action Control Section ---
    {
      header: "Actions",
      className: "text-right sticky right-0 bg-white",
      render: (emp) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(emp)}
            className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(emp.employeeId)}
            className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen">
      {/* Page Title Header block */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Manage Employees
        </h1>
        <p className="text-sm text-gray-500">
          Total Workspace Directory:{" "}
          {employees && employees.length > 0
            ? `${employees.length} entries`
            : "0 entries"}
        </p>
      </div>

      {/* Main Table Interface (Houses search, export buttons, layout styles internally) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ReusableTable
          data={employees as Employee[]}
          columns={columns}
          rowKey="employeeId"
          emptyMessage="No employees found in system records."
        />
      </div>
    </div>
  );
}
