import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SystemUser {
  user_id: string; // Maps to MongoDB's _id on the frontend
  display_name: string;
  avatar: string | null;
  email: string;
  role: "superadmin" | "admin" | "user";
}

const roleBadge: Record<string, string> = {
  superadmin: "bg-destructive/15 text-destructive",
  admin: "bg-primary/15 text-primary",
  user: "bg-muted text-muted-foreground",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const UserManagement = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editing, setEditing] = useState<SystemUser | null>(null);
  const [editRole, setEditRole] = useState<SystemUser["role"]>("user");
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetching data from your MongoDB API endpoint

  const openEdit = (u: SystemUser) => {
    setEditing(u);
    setEditRole(u.role);
    setEditDialog(true);
  };

  // 2. Updating data through your MongoDB API endpoint
  const saveRole = async () => {
    if (!editing) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: editing.user_id,
          role: editRole,
        }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      toast.success("Role updated successfully");
      setEditDialog(false);
      fetchUsers(); // Refresh the grid
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role in database");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage system users and roles (SuperAdmin only)
        </p>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Total Users",
            value: users.length,
            color: "text-foreground",
          },
          {
            label: "Super Admins",
            value: users.filter((u) => u.role === "superadmin").length,
            color: "text-destructive",
          },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "admin").length,
            color: "text-primary",
          },
          {
            label: "Users",
            value: users.filter((u) => u.role === "user").length,
            color: "text-muted-foreground",
          },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={item}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.user_id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {u.avatar || u.display_name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{u.display_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                        roleBadge[u.role]
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(u)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit role"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Role — {editing?.display_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select
              value={editRole}
              onValueChange={(v) => setEditRole(v as SystemUser["role"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={saveRole} className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UserManagement;
