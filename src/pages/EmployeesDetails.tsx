import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
import { useParams } from "react-router";

export default function EmployeesDetails() {
  const { id } = useParams();
  const { data: employeesData } = useGetAllEmployeesQuery({ id });

  console.log(employeesData);
  return <div></div>;
}
