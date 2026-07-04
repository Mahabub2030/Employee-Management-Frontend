import { useAuth } from "@/constants/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useAddEmployeesMutation,
} from "@/redux/features/employee/employee.api";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { Column, ReusableTable } from "@/components/ui/reusable-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Updated Interface to Match JSON Data Exactly ---
export interface Employee {
  _id: string; // Changed from id
  name: string;
  email?: string;
  phone?: string;
  phoneNumber?: string; // Matches JSON
  gender?: "male" | "female";
  nationality: string;
  avatar?: string;
  companyName: string;
  department?: string;
  position?: string;
  jobTitle: string; // Matches JSON
  shift?: string;
  workLocation?: string;
  group: string; // Matches JSON
  employeeId: string | number; // Matches JSON
  idNumber: string; // Matches JSON
  dacoId?: string;
  SAPNumber?: string;
  salary?: number | string;
  status: "ACTIVE" | "ON_LEAVE" | "TERMINATED" | string; // Matches JSON uppercase formatting
  joiningDate: Date | string; // Matches JSON
  remark?: string;
  images?: string[];
  updatedAt?: string; // Matches JSON
  createdAt?: string;
}

const shiftOptions = ["Morning", "Afternoon", "Night"];
const departments = [
  "Administrative / Management",
  "Engineering",
  "HR",
  "Marketing",
  "Sales",
];

// Updated to map uppercase database keys safely to the style states
const statusBadge: Record<string, string> = {
  ACTIVE: "bg-success/15 text-success",
  "ON LEAVE": "bg-warning/15 text-warning",
  TERMINATED: "bg-destructive/15 text-destructive",
};

export default function Employees() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "superadmin";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    group: "Administrative / Management",
    jobTitle: "Administrator",
    companyName: "Safari Group",
    employeeId: "",
    idNumber: "",
    nationality: "Saudi",
  });

  // RTK Query Hooks
  const { data: employeesData = [], isLoading } =
    useGetEmployeesQuery(undefined);
  const [addEmployee] = useAddEmployeesMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const openAdd = () => {
    setEditingEmployee(null);
    setForm({
      name: "",
      email: "",
      phoneNumber: "",
      group: "Administrative / Management",
      jobTitle: "Administrator",
      companyName: "Safari Group",
      employeeId: "",
      idNumber: "",
      nationality: "Saudi",
    });
    setDialogOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setForm({
      name: emp.name,
      email: emp.email || "",
      phoneNumber: emp.phoneNumber || "",
      group: emp.group || "Administrative / Management",
      jobTitle: emp.jobTitle || "",
      companyName: emp.companyName || "",
      employeeId: String(emp.employeeId || ""),
      idNumber: emp.idNumber || "",
      nationality: emp.nationality || "Saudi",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Employee name is required");
      return;
    }

    try {
      if (editingEmployee) {
        await updateEmployee({
          id: editingEmployee._id,
          ...form,
        }).unwrap();
        toast.success("Employee updated successfully");
      } else {
        await addEmployee({
          ...form,
          status: "ACTIVE",
        }).unwrap();
        toast.success("Employee added successfully");
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Operation failed: " + (error?.message || "Unknown error"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id).unwrap();
      toast.success("Employee profile deleted");
    } catch (error) {
      toast.error("Failed to execute deletion tracking hook");
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employeesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees_report.xlsx");
    toast.success("Excel sheet downloaded");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Company Employee Register", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Emp ID", "Name", "Job Title", "Group", "Company", "Status"]],
      body: employeesData.map((e: Employee) => [
        e.employeeId,
        e.name,
        e.jobTitle,
        e.group,
        e.companyName,
        e.status,
      ]),
    });
    doc.save("employees.pdf");
    toast.success("PDF generated successfully");
  };

  // --- Dynamic Headings Structured with new Keys ---
  const columns: Column<Employee>[] = [
    {
      key: "employeeId",
      header: "ID",
      accessor: "employeeId",
      className: "font-mono text-xs text-muted-foreground",
    },
    {
      key: "name",
      header: "Employee Details",
      render: (emp) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-purple-700">
              {emp.avatar || emp.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{emp.name}</p>
            <p className="text-xs text-muted-foreground">
              {emp.email || "No Email Email Listed"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "jobTitle",
      header: "Job Title",
      accessor: "jobTitle",
    },
    {
      key: "group",
      header: "Group Category",
      accessor: "group",
      hideOn: "md",
    },
    {
      key: "companyName",
      header: "Company",
      accessor: "companyName",
      hideOn: "lg",
    },
    {
      key: "status",
      header: "Status",
      render: (emp) => (
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
            statusBadge[emp.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {emp.status}
        </span>
      ),
    },
    {
      key: "joiningDate",
      header: "Joining Date",
      hideOn: "lg",
      render: (emp) => (
        <span className="text-muted-foreground text-xs">
          {emp.joiningDate
            ? new Date(emp.joiningDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    ...(canEdit
      ? [
          {
            key: "actions",
            header: "Actions",
            className: "text-right",
            render: (emp: Employee) => (
              <div
                className="flex items-center justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => openEdit(emp)}
                  className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ),
          } as Column<Employee>,
        ]
      : []),
  ];

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading master records...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 container mx-auto">
        <ReusableTable<Employee>
          data={employeesData}
          columns={columns}
          rowKey={(e) => e._id} // Maps to database document payload key
          onRowClick={(e) => navigate(`/employees/${e._id}`)}
          searchKeys={[
            "name",
            "jobTitle",
            "group",
            "companyName",
            "employeeId",
          ]}
          emptyMessage="No registry matches found inside our dataset query parameters."
          actions={
            <>
              <Button variant="outline" size="sm" onClick={exportExcel}>
                <Download className="h-4 w-4 mr-1" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={exportPDF}>
                <FileText className="h-4 w-4 mr-1" /> PDF
              </Button>
              {canEdit && (
                <Button
                  size="sm"
                  onClick={openAdd}
                  className="bg-purple-700 hover:bg-purple-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Employee
                </Button>
              )}
            </>
          }
          page={0}
        />

        {/* Modal Form Handling Framework Layout Component updates */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee
                  ? "Modify Employee Record"
                  : "Register New Employee"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Full Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Email
                  </label>
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Employee ID
                  </label>
                  <Input
                    value={form.employeeId}
                    onChange={(e) =>
                      setForm({ ...form, employeeId: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    ID Number (Iqama/National)
                  </label>
                  <Input
                    value={form.idNumber}
                    onChange={(e) =>
                      setForm({ ...form, idNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Phone Number
                  </label>
                  <Input
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Nationality
                  </label>
                  <Input
                    value={form.nationality}
                    onChange={(e) =>
                      setForm({ ...form, nationality: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Company Entity
                  </label>
                  <Input
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({ ...form, companyName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Job Title Description
                  </label>
                  <Input
                    value={form.jobTitle}
                    onChange={(e) =>
                      setForm({ ...form, jobTitle: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="w-full mt-2 bg-purple-700 text-white hover:bg-purple-800"
              >
                {editingEmployee ? "Apply Modifications" : "Save System Record"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
