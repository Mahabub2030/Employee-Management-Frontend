import { ReusableTable } from "@/components/ui/reusable-table";
import { useGetAlluserQuery } from "@/redux/features/auth/auth.api";

export default function UserManagmnets() {
  const { data: users } = useGetAlluserQuery(undefined);
  console.log(users);

  const columns = [
    { header: "User ID", accessor: "userId" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status" },
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
          {users && users.length > 0 ? `${users.length} entries` : "0 entries"}
        </p>
      </div>

      {/* Main Table Interface (Houses search, export buttons, layout styles internally) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ReusableTable
          data={users as User[]}
          columns={columns}
          rowKey="userId"
          emptyMessage="No employees found in system records."
        />
      </div>
    </div>
  );
}
