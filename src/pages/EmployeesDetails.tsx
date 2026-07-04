import { useGetSingalEmployeesQuery } from "@/redux/features/employee/employee.api";
import { useParams } from "react-router";

export default function EmployeesDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetSingalEmployeesQuery({ _id: id });
  return (
    <div>
      <h1>Employee Details</h1>
      <p>Employee ID: {id}</p>
      <p>Name: {data?.name}</p>
    </div>
  );
}
