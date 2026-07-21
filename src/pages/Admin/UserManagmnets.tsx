import { ReusableTable, Column } from "@/components/ui/reusable-table";
import { useGetAlluserQuery } from "@/redux/features/auth/auth.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  MoreVertical,
  ShieldCheck,
  UserMinus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 1. Explicitly define your User structure for TypeScript type safety
export interface User {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee" | string;
  status: "active" | "blocked" | "pending" | string;
}

export default function UserManagmnets() {
  const { data: users, isLoading } = useGetAlluserQuery(undefined);

  // Administrative action handlers
  const handleUpdateRole = (user: User, newRole: string) => {
    // Connect your RTK Mutation here (e.g., updateRoleMutation({ id: user.userId, role: newRole }))
    alert(`Updating ${user.name}'s role to ${newRole}`);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to permanently remove ${user.name}?`)) {
      // Connect your RTK Mutation here (e.g., deleteUserMutation(user.userId))
      alert(`Deleted user: ${user.name}`);
    }
  };

  // 2. Define the structural matrix columns with specific type annotations
  const columns: Column<User>[] = [
    {
      key: "userId",
      header: "User ID",
      accessor: "userId",
      className: "font-mono text-xs text-muted-foreground",
    },
    { key: "name", header: "Name", accessor: "name", className: "font-medium" },
    { key: "email", header: "Email", accessor: "email" },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <Badge
          variant={user.role === "admin" ? "default" : "secondary"}
          className="capitalize"
        >
          {user.role}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => {
        const isBlocked = user.status === "blocked";
        return (
          <Badge
            variant="outline"
            className={
              isBlocked
                ? "border-destructive text-destructive bg-destructive/10"
                : "border-green-500 text-green-600 bg-green-50"
            }
          >
            {user.status}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      // Important: Stop event propagation so clicking an action button doesn't trigger row selection redirects
      render: (user) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Quick Role Change Options */}
              <DropdownMenuItem onClick={() => handleUpdateRole(user, "admin")}>
                <ShieldCheck className="mr-2 h-4 w-4 text-purple-600" />
                Make Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateRole(user, "employee")}
              >
                <UserMinus className="mr-2 h-4 w-4 text-blue-600" />
                Make Employee
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              {/* Core Delete Action */}
              <DropdownMenuItem
                onClick={() => handleDeleteUser(user)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading data index repositories...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen space-y-6">
      {/* Page Title Header block */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Manage Employees
        </h1>
        <p className="text-sm text-gray-500">
          Total Workspace Directory:{" "}
          {users && users.length > 0 ? `${users.length} entries` : "0 entries"}
        </p>
      </div>

      {/* Main Table Layout block wrapper */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <ReusableTable<User>
          data={(users || []) as User[]}
          columns={columns}
          // Fix: Passed an evaluator callback mapping function instead of a bare string token
          rowKey={(user) => user.userId}
          searchKeys={["name", "email", "role"]}
          emptyMessage="No employees found in system records matching query inputs."
          pageSize={10}
        />
      </div>
    </div>
  );
}
