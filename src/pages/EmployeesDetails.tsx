import { useAuth } from "@/constants/AuthContext";
import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
import { useParams } from "react-router";

export default function EmployeesDetails() {
  const { id } = useParams();
  const { data } = useGetAllEmployeesQuery(id);
  const { user, loading } = useAuth();
  // Inside your Login page/handler

  if (loading) {
    return <div>Loading authcation.....</div>;
  }
  console.log("Logged in user:", user);
  return <div></div>;
}
