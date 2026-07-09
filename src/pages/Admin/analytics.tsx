// import React, { useMemo, useRef, useEffect } from "react";
// import * as d3 from "d3";

// // 1. Static mock data source
// const mockJsonData = {
//   unemploymentData: [
//     { rate: 4.2 },
//     { rate: 4.5 },
//     { rate: 5.1 },
//     { rate: 3.8 },
//     { rate: 6.2 },
//     { rate: 4.5 },
//     { rate: 5.3 },
//     { rate: 4.1 },
//     { rate: null },
//     { rate: 3.9 },
//     { rate: 4.8 },
//     { rate: 5.0 },
//   ],
// };

// export interface UnemploymentData {
//   rate?: number | null;
//   [key: string]: any;
// }

// interface AnalyticsProps {
//   data: UnemploymentData[];
// }

// // --- The D3 Chart Sub-Component ---
// function Chart({ data }: AnalyticsProps) {
//   const width = 960;
//   const height = 500;
//   const marginTop = 20;
//   const marginRight = 20;
//   const marginBottom = 30;
//   const marginLeft = 40;

//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);

//   const { bins, xScale, yScale } = useMemo(() => {
//     if (!data || data.length === 0)
//       return { bins: [], xScale: null, yScale: null };

//     // Filter out missing/undefined records completely
//     const validData = data.filter(
//       (d) => d.rate !== undefined && d.rate !== null,
//     );

//     if (validData.length === 0) return { bins: [], xScale: null, yScale: null };

//     const binGenerator = d3
//       .bin<UnemploymentData, number>()
//       .thresholds(40)
//       .value((d) => d.rate!);

//     const computedBins = binGenerator(validData);

//     const firstX0 = computedBins[0]?.x0 ?? 0;
//     const lastX1 = computedBins[computedBins.length - 1]?.x1 ?? width;

//     const x = d3
//       .scaleLinear()
//       .domain([firstX0, lastX1])
//       .range([marginLeft, width - marginRight]);

//     const y = d3
//       .scaleLinear()
//       .domain([0, d3.max(computedBins, (d) => d.length) ?? 0])
//       .range([height - marginBottom, marginTop]);

//     return { bins: computedBins, xScale: x, yScale: y };
//   }, [data]);

//   useEffect(() => {
//     if (!xAxisRef.current || !yAxisRef.current || !xScale || !yScale) return;

//     d3.select(xAxisRef.current).call(
//       d3
//         .axisBottom(xScale)
//         .ticks(width / 80)
//         .tickSizeOuter(0),
//     );

//     d3.select(yAxisRef.current)
//       .call(d3.axisLeft(yScale).ticks(height / 40))
//       .select(".domain")
//       .remove();
//   }, [xScale, yScale]);

//   if (!data || data.length === 0 || bins.length === 0 || !xScale || !yScale) {
//     return <div style={{ padding: "20px" }}>Awaiting clean chart data...</div>;
//   }

//   return (
//     <svg
//       width={width}
//       height={height}
//       viewBox={`0 0 ${width} ${height}`}
//       style={{ maxWidth: "100%", height: "auto" }}
//     >
//       <g fill="steelblue">
//         {bins.map((d) => {
//           if (d.x0 === undefined || d.x1 === undefined) return null;
//           return (
//             <rect
//               key={d.x0}
//               x={xScale(d.x0) + 1}
//               width={Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)}
//               y={yScale(d.length)}
//               height={Math.max(0, yScale(0) - yScale(d.length))}
//             />
//           );
//         })}
//       </g>
//       <g ref={xAxisRef} transform={`translate(0,${height - marginBottom})`}>
//         <text
//           x={width}
//           y={marginBottom - 4}
//           fill="currentColor"
//           textAnchor="end"
//         >
//           Unemployment rate (%) →
//         </text>
//       </g>
//       <g ref={yAxisRef} transform={`translate(${marginLeft},0)`}>
//         <text x={-marginLeft} y={10} fill="currentColor" textAnchor="start">
//           ↑ Frequency (no. of counties)
//         </text>
//       </g>
//     </svg>
//   );
// }

// // --- Main Exported Analytics Page Component ---
// export default function AnalyticsPage() {
//   return (
//     <div
//       style={{
//         padding: "40px",
//         fontFamily: "sans-serif",
//         maxWidth: "1200px",
//         margin: "0 auto",
//       }}
//     >
//       <h2 style={{ marginBottom: "8px" }}>Analytics Overview</h2>
//       <p style={{ color: "#666", marginBottom: "24px" }}>
//         Visualizing data frequencies from county distribution records.
//       </p>

//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #e4e4e7",
//           borderRadius: "8px",
//           padding: "20px",
//         }}
//       >
//         <Chart data={mockJsonData.unemploymentData} />
//       </div>
//     </div>
//   );
// }
import React, { useMemo, useRef, useEffect, useState } from "react";
import * as d3 from "d3";

// --- Mock Dataset structured explicitly after image_36d004.png ---
const hrDashboardData = {
  filters: {
    departments: [
      "Accounting",
      "Administration",
      "Customer Support",
      "Finance",
      "Human Resources",
      "IT",
      "Marketing",
      "R&D",
      "Sales",
    ],
    locations: ["Boston", "Miami", "Los Angeles", "Chicago", "New York"],
    years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008],
  },
  summary2008: [
    { label: "Total Salaries", value: "$ 5,696,000" },
    { label: "Total Bonuses", value: "$ 483,848" },
    { label: "Total Overtimes", value: "$ 136,327" },
    { label: "Total Commissions", value: "$ 931,000" },
    { label: "Total Compensations", value: "$ 7,247,175" },
    { label: "Total Employees", value: "81" },
    { label: "Average Salary", value: "$ 70,321" },
    { label: "Total Sick Days", value: "470" },
    { label: "Average Sick Days per Emp.", value: "5.8" },
  ],
  employeeGrowth: [
    { year: 2000, count: 5 },
    { year: 2001, count: 18 },
    { year: 2002, count: 27 },
    { year: 2003, count: 42 },
    { year: 2004, count: 51 },
    { year: 2005, count: 58 },
    { year: 2006, count: 63 },
    { year: 2007, count: 71 },
    { year: 2008, count: 81 },
  ],
  employeeList: [
    "Harman Abraha",
    "Heela Kraft",
    "Ian Helmer",
    "Jacqueline N. Gappy",
    "Jacqueline N. Hildebrandt",
    "James Oberndorfer",
    "James Wilson",
    "Janalee Eggleston",
    "Jena Coon",
    "Jeremiah De Grazia",
  ],
  selectedEmployee: {
    name: "James Oberndorfer",
    hireDate: "4/26/08",
    location: "Boston",
    termDate: "-",
    emplType: "Full-Time",
    year: 2008,
    baseSalary: 80000,
    bonus: 8800,
    overtime: 0,
    commission: 24000,
    totalComp: 112800,
    department: "Sales",
    ptoDays: 13,
    sickDays: 3,
    performScore: 2,
  },
};

interface GrowthData {
  year: number;
  count: number;
}

// --- D3 Historical Trend Bar Chart Sub-Component ---
function EmployeeGrowthChart({ data }: { data: GrowthData[] }) {
  const width = 450;
  const height = 180;
  const margin = { top: 15, right: 15, bottom: 25, left: 35 };

  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);

  const { xScale, yScale } = useMemo(() => {
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.year.toString()))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    return { xScale: x, yScale: y };
  }, [data]);

  useEffect(() => {
    if (!xAxisRef.current || !yAxisRef.current) return;
    d3.select(xAxisRef.current).call(d3.axisBottom(xScale).tickSize(3));
    d3.select(yAxisRef.current).call(d3.axisLeft(yScale).ticks(5).tickSize(3));
  }, [xScale, yScale]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto" }}
    >
      <g fill="#4f81bd">
        {data.map((d) => (
          <rect
            key={d.year}
            x={xScale(d.year.toString())}
            y={yScale(d.count)}
            width={xScale.bandwidth()}
            height={height - margin.bottom - yScale(d.count)}
          />
        ))}
      </g>
      <g
        ref={xAxisRef}
        transform={`translate(0,${height - margin.bottom})`}
        fontSize="9"
        color="#555"
      />
      <g
        ref={yAxisRef}
        transform={`translate(${margin.left},0)`}
        fontSize="9"
        color="#555"
      />
    </svg>
  );
}

// --- Main Structural Dashboard Page ---
export default function HRDashboardPage() {
  const [selectedDept, setSelectedDept] = useState("Sales");
  const [selectedLoc, setSelectedLoc] = useState("Boston");
  const [selectedYear, setSelectedYear] = useState(2008);
  const [selectedEmp, setSelectedEmp] = useState("James Oberndorfer");

  const emp = hrDashboardData.selectedEmployee;

  return (
    <div
      style={{
        backgroundColor: "#dbe5f1",
        padding: "12px",
        fontFamily: "Calibri, Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* HEADER BAR */}
      <div
        style={{
          backgroundColor: "#8db4e2",
          padding: "8px 16px",
          border: "1px solid #366092",
          marginBottom: "12px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "20px",
            color: "#1e395b",
            fontWeight: "bold",
          }}
        >
          HR Dashboard
        </h1>
      </div>

      {/* DASHBOARD GRID STRUCTURE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "12px",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: INTERACTIVE FILTERS & LISTBOXES */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Department Filter Selector */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #7f9db9" }}>
            <div
              style={{
                backgroundColor: "#1f497d",
                color: "#fff",
                padding: "3px 6px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Department
            </div>
            <div
              style={{
                maxHeight: "130px",
                overflowY: "scroll",
                fontSize: "12px",
              }}
            >
              {hrDashboardData.filters.departments.map((dept) => (
                <div
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  style={{
                    padding: "3px 6px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedDept === dept ? "#3399ff" : "transparent",
                    color: selectedDept === dept ? "#fff" : "#000",
                  }}
                >
                  {dept}
                </div>
              ))}
            </div>
          </div>

          {/* Location Filter Selector */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #7f9db9" }}>
            <div
              style={{
                backgroundColor: "#1f497d",
                color: "#fff",
                padding: "3px 6px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Location
            </div>
            <div style={{ fontSize: "12px" }}>
              {hrDashboardData.filters.locations.map((loc) => (
                <div
                  key={loc}
                  onClick={() => setSelectedLoc(loc)}
                  style={{
                    padding: "3px 6px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedLoc === loc ? "#3399ff" : "transparent",
                    color: selectedLoc === loc ? "#fff" : "#000",
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          </div>

          {/* Year Filter Selector */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #7f9db9" }}>
            <div
              style={{
                backgroundColor: "#1f497d",
                color: "#fff",
                padding: "3px 6px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Year
            </div>
            <div
              style={{
                maxHeight: "110px",
                overflowY: "scroll",
                fontSize: "12px",
              }}
            >
              {hrDashboardData.filters.years.map((yr) => (
                <div
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  style={{
                    padding: "3px 6px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedYear === yr ? "#3399ff" : "transparent",
                    color: selectedYear === yr ? "#fff" : "#000",
                  }}
                >
                  {yr}
                </div>
              ))}
            </div>
          </div>

          {/* Employee Records Filter Selector */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #7f9db9" }}>
            <div
              style={{
                backgroundColor: "#1f497d",
                color: "#fff",
                padding: "3px 6px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Employee
            </div>
            <div
              style={{
                maxHeight: "180px",
                overflowY: "scroll",
                fontSize: "12px",
              }}
            >
              {hrDashboardData.employeeList.map((name) => (
                <div
                  key={name}
                  onClick={() => setSelectedEmp(name)}
                  style={{
                    padding: "3px 6px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedEmp === name ? "#3399ff" : "transparent",
                    color: selectedEmp === name ? "#fff" : "#000",
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN METRICS GRID PLOTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* UPPER TOP ROW DASHES: Aggregations & Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {/* Annual Performance Metric Grid Summary */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #7f9db9",
                padding: "8px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#b9cde5",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "2px",
                  border: "1px solid #95b3d7",
                  marginBottom: "6px",
                }}
              >
                Summary for year {selectedYear}
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <tbody>
                  {hrDashboardData.summary2008.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#f2f2f2" : "#fff",
                      }}
                    >
                      <td style={{ padding: "3px 6px", color: "#333" }}>
                        {row.label}
                      </td>
                      <td
                        style={{
                          padding: "3px 6px",
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#000",
                        }}
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* D3 Enterprise Historical Capacity Graph Panel */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #7f9db9",
                padding: "8px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#b9cde5",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "2px",
                  border: "1px solid #95b3d7",
                  marginBottom: "6px",
                }}
              >
                Total employees trend distributions
              </div>
              <EmployeeGrowthChart data={hrDashboardData.employeeGrowth} />
            </div>
          </div>

          {/* LOWER PROFILE INSPECTOR: Active Selected Employee Summary Panel */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 2fr",
              gap: "12px",
              backgroundColor: "#fff",
              border: "1px solid #7f9db9",
              padding: "8px",
            }}
          >
            {/* Table Profile Specs Breakdown */}
            <div>
              <div
                style={{
                  backgroundColor: "#8db4e2",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "4px 8px",
                  color: "#1e395b",
                  marginBottom: "8px",
                }}
              >
                Employee Information: {selectedEmp}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  fontSize: "12px",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>Name</td>
                      <td style={{ fontWeight: "bold" }}>{emp.name}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Hire Date
                      </td>
                      <td>{emp.hireDate}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Location
                      </td>
                      <td>{emp.location}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Term. Date
                      </td>
                      <td>{emp.termDate}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Empl. Type
                      </td>
                      <td>{emp.emplType}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>Year</td>
                      <td>{emp.year}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Base Salary
                      </td>
                      <td style={{ fontWeight: "600" }}>
                        ${emp.baseSalary.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>Bonus</td>
                      <td>${emp.bonus.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Overtime
                      </td>
                      <td>${emp.overtime.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Commission
                      </td>
                      <td>${emp.commission.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Total Comp.
                      </td>
                      <td style={{ fontWeight: "bold", color: "#1e395b" }}>
                        ${emp.totalComp.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Department
                      </td>
                      <td style={{ color: "#e46c0a", fontWeight: "600" }}>
                        {emp.department}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        PTO Days
                      </td>
                      <td>{emp.ptoDays}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Sick Days
                      </td>
                      <td>{emp.sickDays}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "#555", padding: "3px 0" }}>
                        Perform. Score
                      </td>
                      <td>{emp.performScore}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Micro Targeted Single Representation Visualization */}
            <div
              style={{ borderLeft: "1px solid #d9d9d9", paddingLeft: "12px" }}
            >
              <div
                style={{
                  backgroundColor: "#8db4e2",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "4px 8px",
                  color: "#1e395b",
                  marginBottom: "8px",
                }}
              >
                Employee total compensation
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  height: "120px",
                  paddingBottom: "10px",
                  backgroundColor: "#fafafa",
                  border: "1px dashed #ccc",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "90px",
                    backgroundColor: "#4f81bd",
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "10px",
                    paddingTop: "5px",
                  }}
                >
                  2008
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
