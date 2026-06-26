import { useGetEmployeesQuery } from "@/redux/features/employee/employee.api";

export default function EmployeesDetails() {
  const { data } = useGetEmployeesQuery(undefined);

  console.log(data);
  return <div>EmployeesDetails</div>;
}
