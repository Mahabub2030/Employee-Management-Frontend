import { useEffect, useState } from "react";
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
  Fingerprint,
  Globe,
} from "lucide-react";
import {
  useGetSingalEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "@/redux/features/employee/employee.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/constants/AuthContext";
import { toast } from "sonner";

// Uppercase key badges matching your exact API payload values
const statusBadge: Record<string, string> = {
  ACTIVE: "bg-success/15 text-success",
  "ON LEAVE": "bg-warning/15 text-warning",
  TERMINATED: "bg-destructive/15 text-destructive",
};

const statusOptions = ["ACTIVE", "ON LEAVE", "TERMINATED"];

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "superadmin";
  const { data: employee, isLoading } = useGetSingalEmployeesQuery(id || "", {
    skip: !id,
  });
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    group: "Administrative / Management",
    jobTitle: "",
    companyName: "Safari Group",
    employeeId: "",
    idNumber: "",
    nationality: "Saudi",
    status: "ACTIVE",
  });

  // Keep form details correctly synced with RTK Query cache payload mounts

  const openEdit = () => {
    if (!employee) return;
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!employee) return;
    if (!form.name.trim() || !form.employeeId.trim()) {
      toast.error("Name and Employee ID fields are required");
      return;
    }

    try {
      await updateEmployee({ id: employee._id, ...form }).unwrap();
      toast.success("Employee updated successfully");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update employee");
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    if (!confirm("Are you sure you want to permanently delete this employee?"))
      return;

    try {
      await deleteEmployee(employee._id).unwrap();
      toast.success("Employee deleted successfully");
      navigate("/employees");
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm p-6">
        Loading employee registry profile...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-4 container mx-auto p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Employee record not found
        </div>
      </div>
    );
  }

  // Elegant dynamic details component helper function

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Action Nav Menu */}
      <div className="flex items-center justify-between gap-3 ">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1 container" /> Back
        </Button>
        {canEdit && (
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
        )}
      </div>

      {/* Main Glass Header Card */}
      <div className="glass-card rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"></div>

      {/* Update Dialog Drawer Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Employee Details</DialogTitle>
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
                <label className="text-sm text-muted-foreground mb-1 block">
                  National ID / Iqama
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
                <label className="text-sm text-muted-foreground mb-1 block">
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
                  Group Category
                </label>
                <Input
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full mt-2 bg-purple-700 hover:bg-purple-800 text-white"
            >
              Update Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EmployeeDetails;
