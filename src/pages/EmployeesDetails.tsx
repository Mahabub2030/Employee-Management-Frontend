import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Building2,
  MapPin,
  Flag,
  Calendar,
  BadgeCheck,
  IdCard,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/constants/AuthContext";
import { toast } from "sonner";

// ⚠️ Confirm these hook names against your actual employee.api.ts.
// Kept "useGetSingalEmployeesQuery" as-is to match your file — you may
// want to rename it to useGetSingleEmployeeQuery later (typo: Singal -> Single),
// just update this import + the call below if you rename it.
import {
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetSingalEmployeesQuery,
} from "@/redux/features/employee/employee.api";

// Matches the actual MongoDB document shape returned by your API
type Employee = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  workLocation?: string;
  images?: string[];
  jobTitle: string;
  idNumber?: string;
  employeeId?: string;
  dacoId?: string;
  group: string; // e.g. "Administrative / Management"
  joiningDate?: string;
  nationality?: string;
  companyName?: string;
  status: string; // e.g. "ACTIVE"
  remark?: string;
  updatedAt: string;
};

const statusOptions = ["ACTIVE", "ON_LEAVE", "TERMINATED"];

const statusBadge: Record<string, string> = {
  ACTIVE: "bg-success/15 text-success",
  ON_LEAVE: "bg-warning/15 text-warning",
  TERMINATED: "bg-destructive/15 text-destructive",
};

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("auth user:", user); // TEMP: check the shape/value of user + role in your console

  // Only these roles can see Update/Delete. Add more role strings here if needed
  // (comparison is lowercased, so "Admin", "ADMIN", "admin" all match).
  const ALLOWED_ROLES = ["admin", "superadmin"];
  const role = (user?.role || "").toString().toLowerCase();
  const canEdit = ALLOWED_ROLES.includes(role);

  const {
    data: employee,
    isLoading,
    isError,
    refetch,
  } = useGetSingalEmployeesQuery({ id: id! }, { skip: !id });

  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    group: "",
    workLocation: "",
    nationality: "",
    companyName: "",
    status: "ACTIVE",
    remark: "",
  });

  const openEdit = () => {
    if (!employee) return;
    setForm({
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber || "",
      jobTitle: employee.jobTitle,
      group: employee.group,
      workLocation: employee.workLocation || "",
      nationality: employee.nationality || "",
      companyName: employee.companyName || "",
      status: employee.status,
      remark: employee.remark || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!employee) return;
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email required");
      return;
    }

    try {
      await updateEmployee({
        id: employee._id,
        body: {
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          jobTitle: form.jobTitle,
          group: form.group,
          workLocation: form.workLocation,
          nationality: form.nationality,
          companyName: form.companyName,
          status: form.status,
          remark: form.remark,
        },
      }).unwrap();
      toast.success("Employee updated");
      setDialogOpen(false);
      refetch();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    try {
      await deleteEmployee(employee._id).unwrap();
      toast.success("Employee deleted");
      navigate("/employees");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">Loading employee...</div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Employee not found
        </div>
      </div>
    );
  }

  const initials = employee.name
    .split(" ")
    .map((n: any[]) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const detail = (Icon: typeof Mail, label: string, value: React.ReactNode) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/50">
      <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5 break-words">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={openEdit}>
              <Pencil className="h-4 w-4 mr-1" /> Update
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />{" "}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0 glow-border">
            <span className="text-2xl font-bold text-primary">{initials}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{employee.name}</h1>
            <p className="text-muted-foreground text-sm">
              {employee.jobTitle} · {employee.group}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  statusBadge[employee.status] || ""
                }`}
              >
                {employee.status}
              </span>
              {employee.employeeId && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-muted/40 text-muted-foreground">
                  ID: {employee.employeeId}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {detail(Mail, "Email", employee.email)}
        {detail(Phone, "Phone", employee.phoneNumber)}
        {detail(Briefcase, "Job Title", employee.jobTitle)}
        {detail(Building2, "Group", employee.group)}
        {detail(Building2, "Company", employee.companyName)}
        {detail(MapPin, "Work Location", employee.workLocation)}
        {detail(Flag, "Nationality", employee.nationality)}
        {detail(IdCard, "ID Number", employee.idNumber)}
        {detail(BadgeCheck, "Status", employee.status)}
        {detail(
          Calendar,
          "Joining Date",
          employee.joiningDate
            ? new Date(employee.joiningDate).toLocaleDateString()
            : "—",
        )}
      </div>

      {employee.remark && (
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Remark</p>
          <p className="text-sm">{employee.remark}</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Name
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
                  Phone
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
                  Group
                </label>
                <Input
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Work Location
                </label>
                <Input
                  value={form.workLocation}
                  onChange={(e) =>
                    setForm({ ...form, workLocation: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Company
                </label>
                <Input
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Remark
                </label>
                <Input
                  value={form.remark}
                  onChange={(e) => setForm({ ...form, remark: e.target.value })}
                />
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="w-full mt-2"
            >
              {isUpdating ? "Saving..." : "Update Employee"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {employee.name} from the system. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default EmployeeDetails;
