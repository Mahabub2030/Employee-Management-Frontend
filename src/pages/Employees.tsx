// import React, { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { useGetEmployeesQuery } from "@/redux/features/employee/employee.api";
// import html2pdf from "html2pdf.js";
// import { Link } from "react-router";
// import * as XLSX from "xlsx";

// export default function Employees() {
//   // 1. Fetching data from your Redux API hook
//   const { data, isLoading, isError } = useGetEmployeesQuery({
//     page: 1,
//     limit: 50, // Higher limit so client-side pagination can chunk all rows cleanly
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesLimit, setEntriesLimit] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   // 2. Client-side Search Filter with safe array fallback to fix 'undefined' error
//   const filteredData = useMemo(() => {
//     const employeeList = data || [];
//     return employeeList.filter((emp: any) => {
//       const name = emp?.name || "";
//       const empId = emp?.employeeId || "";
//       const idNum = emp?.idNumber || "";
//       const nation = emp?.nationality || "";
//       const groupName = emp?.group || "";
//       const company = emp?.companyName || "";
//       const statusStr = emp?.status || "";

//       const criteria =
//         `${name} ${empId} ${idNum} ${nation} ${groupName} ${company} ${statusStr}`.toLowerCase();
//       return criteria.includes(searchTerm.toLowerCase());
//     });
//   }, [data, searchTerm]);

//   // 3. Dynamic Pagination Calculations
//   const totalPages = Math.ceil(filteredData.length / entriesLimit) || 1;

//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * entriesLimit;
//     return filteredData.slice(startIndex, startIndex + entriesLimit);
//   }, [filteredData, currentPage, entriesLimit]);

//   const startEntryIndex =
//     filteredData.length === 0 ? 0 : (currentPage - 1) * entriesLimit + 1;
//   const endEntryIndex = Math.min(
//     currentPage * entriesLimit,
//     filteredData.length,
//   );

//   // 4. Action Event Handlers
//   const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setEntriesLimit(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   // 5. File Export Actions (Excel)
//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       filteredData.map((emp: any, idx: number) => ({
//         "Sr.No": idx + 1,
//         Name: emp.name,
//         "Job Title": emp.jobTitle,
//         "Employee ID": emp.employeeId,
//         "ID Number": emp.idNumber,
//         Group: emp.group,
//         Nationality: emp.nationality,
//         Company: emp.companyName,
//         "Joining Date": emp.joiningDate
//           ? new Date(emp.joiningDate).toLocaleDateString()
//           : "N/A",
//         Status: emp.status,
//         Remark: emp.remark || "",
//       })),
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Employees");
//     XLSX.writeFile(wb, "employees_list.xlsx");
//   };

//   // 6. File Export Actions (PDF)
//   const exportToPDF = () => {
//     const element = document.getElementById("employee-table");
//     if (element) {
//       html2pdf()
//         .from(element)
//         .set({
//           margin: [10, 10, 10, 10],
//           filename: "employees_report.pdf",
//           html2canvas: { scale: 2, useCORS: true },
//           jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
//         })
//         .save();
//     }
//   };

//   // 7. Core Async Loading and Error UI Safeguards
//   if (isLoading)
//     return (
//       <p className="text-center py-10 font-medium">Loading employees...</p>
//     );
//   if (isError)
//     return (
//       <p className="text-center py-10 text-red-500 font-medium">
//         Failed to load employees. Please wait a minute & check with developer.
//       </p>
//     );

//   return (
//     <div className="py-8 px-2 sm:px-4 md:px-8 container mx-auto text-black dark:text-black">
//       {/* Dynamic Counter Card Box at the Top */}
//       <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         <div className="bg-white border p-4 rounded-lg shadow-sm flex flex-col justify-center">
//           <span className="text-gray-500 font-medium text-sm tracking-wide uppercase">
//             Total Records
//           </span>
//           <span className="text-3xl font-bold text-[#4F2176]">
//             {filteredData.length}
//           </span>
//         </div>
//       </div>

//       {/* Top Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
//         <div className="flex items-center gap-2">
//           <label className="font-medium">Show</label>
//           <select
//             value={entriesLimit}
//             onChange={handleLimitChange}
//             className="border rounded px-2 py-1 text-sm sm:text-base bg-white border-gray-300"
//           >
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </select>
//           <span>entries</span>
//         </div>
//         <div className="w-full sm:w-auto">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             placeholder="Search matching details..."
//             className="border border-gray-300 rounded px-3 py-1 text-sm sm:text-base w-full sm:w-64 bg-white"
//           />
//         </div>
//       </div>

//       {/* Download Action Controls */}
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={exportToExcel}
//           className="px-4 py-1.5 rounded text-white text-sm sm:text-base cursor-pointer bg-[#4F2176] hover:bg-[#3d1a5c] transition font-medium shadow-sm"
//         >
//           Excel
//         </button>
//         <button
//           onClick={exportToPDF}
//           className="px-4 py-1.5 rounded text-white text-sm sm:text-base cursor-pointer bg-[#4F2176] hover:bg-[#3d1a5c] transition font-medium shadow-sm"
//         >
//           PDF
//         </button>
//       </div>

//       {/* Main Table Segment */}
//       <div
//         className="overflow-x-auto border rounded bg-white shadow-sm"
//         id="employee-table"
//       >
//         <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
//           <thead className="bg-[#4F2176] text-white">
//             <tr>
//               <th className="px-3 py-3 text-left font-semibold">Sr.No</th>
//               <th className="px-3 py-3 text-left font-semibold">Name</th>
//               <th className="px-3 py-3 text-left font-semibold">Job Title</th>
//               <th className="px-3 py-3 text-left font-semibold">Employee ID</th>
//               <th className="px-3 py-3 text-left font-semibold hidden md:table-cell">
//                 ID Number
//               </th>
//               <th className="px-3 py-3 text-left font-semibold hidden lg:table-cell">
//                 Group
//               </th>
//               <th className="px-3 py-3 text-left font-semibold hidden lg:table-cell">
//                 Nationality
//               </th>
//               <th className="px-3 py-3 text-left font-semibold hidden xl:table-cell">
//                 Company
//               </th>
//               <th className="px-3 py-3 text-left font-semibold hidden xl:table-cell">
//                 Joining Date
//               </th>
//               <th className="px-3 py-3 text-left font-semibold">Status</th>
//               <th className="px-3 py-3 text-left font-semibold">Action</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {paginatedData.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={11}
//                   className="text-center py-10 text-gray-500 font-medium"
//                 >
//                   No records match your search criteria.
//                 </td>
//               </tr>
//             ) : (
//               paginatedData.map((employee: any, idx: number) => (
//                 <tr
//                   key={employee._id || employee.idNumber || idx}
//                   className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
//                 >
//                   <td className="px-3 py-3 text-gray-600">
//                     {(currentPage - 1) * entriesLimit + idx + 1}
//                   </td>
//                   <td className="px-3 py-3 font-medium text-gray-900">
//                     {employee.name}
//                   </td>
//                   <td className="px-3 py-3 text-gray-700 capitalize">
//                     {employee.jobTitle}
//                   </td>
//                   <td className="px-3 py-3 text-gray-700">
//                     {employee.employeeId || "N/A"}
//                   </td>
//                   <td className="px-3 py-3 text-gray-600 hidden md:table-cell">
//                     {employee.idNumber}
//                   </td>
//                   <td className="px-3 py-3 text-gray-600 hidden lg:table-cell">
//                     {employee.group || "—"}
//                   </td>
//                   <td className="px-3 py-3 text-gray-600 hidden lg:table-cell">
//                     {employee.nationality}
//                   </td>
//                   <td className="px-3 py-3 text-gray-600 hidden xl:table-cell">
//                     {employee.companyName || "—"}
//                   </td>
//                   <td className="px-3 py-3 text-gray-600 hidden xl:table-cell">
//                     {employee.joiningDate
//                       ? new Date(employee.joiningDate).toLocaleDateString()
//                       : "—"}
//                   </td>
//                   <td className="px-3 py-3">
//                     <span
//                       className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
//                         employee.status?.toUpperCase() === "ACTIVE"
//                           ? "bg-green-100 text-green-800"
//                           : employee.status?.toUpperCase().includes("VACATION")
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {employee.status}
//                     </span>
//                   </td>
//                   <td className="px-3 py-3">
//                     <Button
//                       asChild
//                       size="sm"
//                       className="bg-[#4F2176] hover:bg-[#3d1a5c] text-white"
//                     >
//                       <Link
//                         to={`/employees/${employee._id || employee.employeeId}`}
//                       >
//                         View
//                       </Link>
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer Interface & Interactive Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-sm sm:text-base text-gray-600 gap-2 sm:gap-0">
//         <span>
//           Showing {startEntryIndex} to {endEntryIndex} of {filteredData.length}{" "}
//           entries
//         </span>
//         <div className="flex gap-1">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 bg-white border-gray-300 font-medium"
//           >
//             Prev
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//             (pageNumber) => (
//               <button
//                 key={pageNumber}
//                 onClick={() => setCurrentPage(pageNumber)}
//                 className={`px-3 py-1 border rounded text-sm font-medium ${
//                   currentPage === pageNumber
//                     ? "bg-[#4F2176] text-white border-[#4F2176]"
//                     : "hover:bg-gray-50 bg-white border-gray-300"
//                 }`}
//               >
//                 {pageNumber}
//               </button>
//             ),
//           )}

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 bg-white border-gray-300 font-medium"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useGetEmployeesQuery } from "@/redux/features/employee/employee.api";
import html2pdf from "html2pdf.js";
import { Link } from "react-router";
import * as XLSX from "xlsx";

export default function Employees() {
  // 1. Fetching data from your Redux API hook
  const { data, isLoading, isError } = useGetEmployeesQuery({
    page: 1,
    limit: 50,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesLimit, setEntriesLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Client-side Search Filter with safe array fallback
  const filteredData = useMemo(() => {
    const employeeList = data || [];
    return employeeList.filter((emp: any) => {
      const name = emp?.name || "";
      const empId = emp?.employeeId || "";
      const idNum = emp?.idNumber || "";
      const nation = emp?.nationality || "";
      const groupName = emp?.group || "";
      const company = emp?.companyName || "";
      const statusStr = emp?.status || "";

      const criteria =
        `${name} ${empId} ${idNum} ${nation} ${groupName} ${company} ${statusStr}`.toLowerCase();
      return criteria.includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm]);

  // 3. Dynamic Metrics Aggregation based on filtered list
  const metrics = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let vacation = 0;

    filteredData.forEach((emp: any) => {
      const status = (emp?.status || "").toUpperCase();
      if (status === "ACTIVE") {
        active++;
      } else if (status === "INACTIVE") {
        inactive++;
      } else if (status.includes("VACATION")) {
        vacation++;
      }
    });

    return { active, inactive, vacation };
  }, [filteredData]);

  // 4. Dynamic Pagination Calculations
  const totalPages = Math.ceil(filteredData.length / entriesLimit) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesLimit;
    return filteredData.slice(startIndex, startIndex + entriesLimit);
  }, [filteredData, currentPage, entriesLimit]);

  const startEntryIndex =
    filteredData.length === 0 ? 0 : (currentPage - 1) * entriesLimit + 1;
  const endEntryIndex = Math.min(
    currentPage * entriesLimit,
    filteredData.length,
  );

  // 5. Action Event Handlers
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 6. File Export Actions (Excel)
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((emp: any, idx: number) => ({
        "Sr.No": idx + 1,
        Name: emp.name,
        "Job Title": emp.jobTitle,
        "Employee ID": emp.employeeId,
        "ID Number": emp.idNumber,
        Group: emp.group,
        Nationality: emp.nationality,
        Company: emp.companyName,
        "Joining Date": emp.joiningDate
          ? new Date(emp.joiningDate).toLocaleDateString()
          : "N/A",
        Status: emp.status,
        Remark: emp.remark || "",
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees_list.xlsx");
  };

  // 7. File Export Actions (PDF)
  const exportToPDF = () => {
    const element = document.getElementById("employee-table");
    if (element) {
      html2pdf()
        .from(element)
        .set({
          margin: [10, 10, 10, 10],
          filename: "employees_report.pdf",
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
        })
        .save();
    }
  };

  // 8. Core Async Loading and Error UI Safeguards
  if (isLoading)
    return (
      <p className="text-center py-10 font-medium">Loading employees...</p>
    );
  if (isError)
    return (
      <p className="text-center py-10 text-red-500 font-medium">
        Failed to load employees. Please wait a minute & check with developer.
      </p>
    );

  return (
    <div className="py-8 px-2 sm:px-4 md:px-8 container mx-auto text-black dark:text-black">
      {/* Metrics Counters Grid Section */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white border p-4 rounded-lg shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 font-medium text-sm tracking-wide uppercase">
            Total Records
          </span>
          <span className="text-3xl font-bold text-[#4F2176]">
            {filteredData.length}
          </span>
        </div>
        {/* Active Card */}
        <div className="bg-white border p-4 rounded-lg shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 font-medium text-sm tracking-wide uppercase">
            Active
          </span>
          <span className="text-3xl font-bold text-green-600">
            {metrics.active}
          </span>
        </div>
        {/* Vacation Card */}
        <div className="bg-white border p-4 rounded-lg shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 font-medium text-sm tracking-wide uppercase">
            Vacation
          </span>
          <span className="text-3xl font-bold text-yellow-600">
            {metrics.vacation}
          </span>
        </div>
        {/* Inactive Card */}
        <div className="bg-white border p-4 rounded-lg shadow-sm flex flex-col justify-center">
          <span className="text-gray-500 font-medium text-sm tracking-wide uppercase">
            Inactive
          </span>
          <span className="text-3xl font-bold text-red-600">
            {metrics.inactive}
          </span>
        </div>
      </div>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <label className="font-medium">Show</label>
          <select
            value={entriesLimit}
            onChange={handleLimitChange}
            className="border rounded px-2 py-1 text-sm sm:text-base bg-white border-gray-300"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search matching details..."
            className="border border-gray-300 rounded px-3 py-1 text-sm sm:text-base w-full sm:w-64 bg-white"
          />
        </div>
      </div>

      {/* Download Action Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-1.5 rounded text-white text-sm sm:text-base cursor-pointer bg-[#4F2176] hover:bg-[#3d1a5c] transition font-medium shadow-sm"
        >
          Excel
        </button>
        <button
          onClick={exportToPDF}
          className="px-4 py-1.5 rounded text-white text-sm sm:text-base cursor-pointer bg-[#4F2176] hover:bg-[#3d1a5c] transition font-medium shadow-sm"
        >
          PDF
        </button>
      </div>

      {/* Main Table Segment */}
      <div
        className="overflow-x-auto border rounded bg-white shadow-sm"
        id="employee-table"
      >
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-[#4F2176] text-white">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Sr.No</th>
              <th className="px-3 py-3 text-left font-semibold">Name</th>
              <th className="px-3 py-3 text-left font-semibold">Job Title</th>
              <th className="px-3 py-3 text-left font-semibold">Employee ID</th>
              <th className="px-3 py-3 text-left font-semibold hidden md:table-cell">
                ID Number
              </th>
              <th className="px-3 py-3 text-left font-semibold hidden lg:table-cell">
                Group
              </th>
              <th className="px-3 py-3 text-left font-semibold hidden lg:table-cell">
                Nationality
              </th>
              <th className="px-3 py-3 text-left font-semibold hidden xl:table-cell">
                Company
              </th>
              <th className="px-3 py-3 text-left font-semibold hidden xl:table-cell">
                Joining Date
              </th>
              <th className="px-3 py-3 text-left font-semibold">Status</th>
              <th className="px-3 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-10 text-gray-500 font-medium"
                >
                  No records match your search criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((employee: any, idx: number) => (
                <tr
                  key={employee._id || employee.idNumber || idx}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-3 py-3 text-gray-600">
                    {(currentPage - 1) * entriesLimit + idx + 1}
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-3 py-3 text-gray-700 capitalize">
                    {employee.jobTitle}
                  </td>
                  <td className="px-3 py-3 text-gray-700">
                    {employee.employeeId || "N/A"}
                  </td>
                  <td className="px-3 py-3 text-gray-600 hidden md:table-cell">
                    {employee.idNumber}
                  </td>
                  <td className="px-3 py-3 text-gray-600 hidden lg:table-cell">
                    {employee.group || "—"}
                  </td>
                  <td className="px-3 py-3 text-gray-600 hidden lg:table-cell">
                    {employee.nationality}
                  </td>
                  <td className="px-3 py-3 text-gray-600 hidden xl:table-cell">
                    {employee.companyName || "—"}
                  </td>
                  <td className="px-3 py-3 text-gray-600 hidden xl:table-cell">
                    {employee.joiningDate
                      ? new Date(employee.joiningDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        employee.status?.toUpperCase() === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : employee.status?.toUpperCase().includes("VACATION")
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Button
                      asChild
                      size="sm"
                      className="bg-[#4F2176] hover:bg-[#3d1a5c] text-white"
                    >
                      <Link
                        to={`/employees/${employee._id || employee.employeeId}`}
                      >
                        View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Interface & Interactive Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-sm sm:text-base text-gray-600 gap-2 sm:gap-0">
        <span>
          Showing {startEntryIndex} to {endEntryIndex} of {filteredData.length}{" "}
          entries
        </span>
        <div className="flex gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 bg-white border-gray-300 font-medium"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-1 border rounded text-sm font-medium ${
                  currentPage === pageNumber
                    ? "bg-[#4F2176] text-white border-[#4F2176]"
                    : "hover:bg-gray-50 bg-white border-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 bg-white border-gray-300 font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
