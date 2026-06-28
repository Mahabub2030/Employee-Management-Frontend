import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  BadgeCheck,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import {
  useDeleteEmployeeMutation,
  useGetSingalEmployeesQuery,
  useUpdateEmployeeMutation,
} from "@/redux/features/employee/employee.api";

// Status styles mapping matching your exact backend status strings ("ACTIVE")
const statusBadge: Record<string, string> = {
  ACTIVE: "bg-success/15 text-success",
  LEAVE: "bg-warning/15 text-warning",
  TERMINATED: "bg-destructive/15 text-destructive",
};

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // RTK Query call passing the URL route parameter ID string
  const {
    data: employee,
    isLoading,
    isError,
  } = useGetSingalEmployeesQuery(id ?? "", { skip: !id });
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    group: "",
    jobTitle: "",
    idNumber: "",
    employeeId: "",
  });

  const openEdit = () => {
    if (!employee) return;
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      phoneNumber: employee.phoneNumber || "",
      group: employee.group || "",
      jobTitle: employee.jobTitle || "",
      idNumber: employee.idNumber || "",
      employeeId: employee.employeeId || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!employee) return;
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      await updateEmployee({
        id: employee._id, // Notice your backend payload uses '_id' instead of 'id'
        updates: {
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          group: form.group,
          jobTitle: form.jobTitle,
          idNumber: form.idNumber,
          employeeId: form.employeeId,
        },
      }).unwrap();

      toast.success("Employee updated successfully");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update employee");
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    if (!confirm("Delete this employee?")) return;

    try {
      await deleteEmployee(employee._id).unwrap();
      toast.success("Employee deleted");
      navigate("/employees");
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  if (isLoading)
    return (
      <div className="text-muted-foreground text-sm p-6">
        Loading employee...
      </div>
    );
  if (isError || !employee) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Employee not found
        </div>
      </div>
    );
  }

  const detail = (Icon: typeof Mail, label: string, value: React.ReactNode) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/50">
      <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openEdit}>
            <Pencil className="h-4 w-4 mr-1" /> Update
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 border bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary">
              {employee.name?.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{employee.name}</h1>
            <p className="text-muted-foreground text-sm">
              {employee.jobTitle} · {employee.group}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  statusBadge[employee.status] ||
                  "bg-muted text-muted-foreground"
                }`}
              >
                {employee.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {detail(Mail, "Email", employee.email || "—")}
        {detail(Phone, "Phone Number", employee.phoneNumber || "—")}
        {detail(Building2, "Group / Department", employee.group || "—")}
        {detail(Briefcase, "Job Title", employee.jobTitle || "—")}
        {detail(
          BadgeCheck,
          "ID Number / National ID",
          employee.idNumber || "—",
        )}
        {detail(BadgeCheck, "Employee ID Code", employee.employeeId || "—")}
        {detail(BadgeCheck, "Nationality", employee.nationality || "—")}
        {detail(
          Calendar,
          "Joining Date",
          employee.joiningDate
            ? new Date(employee.joiningDate).toLocaleDateString()
            : "—",
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Full Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Email
                </label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
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
                <label className="text-sm text-muted-foreground mb-1 block">
                  Job Title
                </label>
                <Input
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Group Group
                </label>
                <Input
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  National ID Number
                </label>
                <Input
                  value={form.idNumber}
                  onChange={(e) =>
                    setForm({ ...form, idNumber: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="w-full mt-2"
            >
              {isUpdating ? "Updating..." : "Update Employee"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EmployeeDetails;
