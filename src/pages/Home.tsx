// export default function Home() {
//   return (
//     <div>
//       {/* hero section */}

//       {/* testimonials section */}

//       {/* team section */}
//     </div>
//   );
// }
import React, { useMemo, useRef, useEffect, useState } from "react";
import * as d3 from "d3";

// --- 1. Mock JSON Data Sets ---
const mockDataset = {
  metrics: [
    { id: "emp-01", name: "Alice Smith", rate: 4.2, department: "Engineering" },
    { id: "emp-02", name: "Bob Jones", rate: 4.5, department: "Sales" },
    { id: "emp-03", name: "Charlie Brown", rate: 5.1, department: "Marketing" },
    { id: "emp-04", name: "David Miller", rate: 3.8, department: "HR" },
    { id: "emp-05", name: "Eva Green", rate: 6.2, department: "Engineering" },
    { id: "emp-06", name: "Frank White", rate: 4.5, department: "Sales" },
    { id: "emp-07", name: "Grace Black", rate: 5.3, department: "Support" },
    { id: "emp-08", name: "Henry Ford", rate: 4.1, department: "Operations" },
    { id: "emp-09", name: "Ivy League", rate: 4.9, department: "Legal" },
    { id: "emp-10", name: "Jack Sparrow", rate: 3.9, department: "Logistics" },
  ],
  services: [
    {
      id: "s1",
      icon: "📊",
      title: "Predictive Analytics",
      desc: "Forecast organizational performance indicators and workforce utilization trends.",
    },
    {
      id: "s2",
      icon: "👥",
      title: "Talent Management",
      desc: "Optimize team allocations and track performance indexes transparently.",
    },
    {
      id: "s3",
      icon: "⚙️",
      title: "Operations Strategy",
      desc: "Streamline workflows with quantitative data-driven metric breakdowns.",
    },
  ],
  team: [
    {
      id: "t1",
      name: "Sarah Jenkins",
      role: "Chief Data Scientist",
      avatar: "👩‍💼",
    },
    {
      id: "t2",
      name: "Marcus Chen",
      role: "Head of HR Analytics",
      avatar: "👨‍💼",
    },
    {
      id: "t3",
      name: "Elena Rostova",
      role: "Lead Solutions Architect",
      avatar: "👩‍💻",
    },
  ],
};

export interface EmployeeMetric {
  id: string;
  rate?: number | null;
  name?: string;
  department?: string;
}

// --- 2. Animated D3 Chart Component ---
function AnimatedChart({ data }: { data: EmployeeMetric[] }) {
  const width = 800;
  const height = 350;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 40;
  const marginLeft = 40;

  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);

  const { bins, xScale, yScale } = useMemo(() => {
    if (!data || data.length === 0)
      return { bins: [], xScale: null, yScale: null };
    const validData = data.filter(
      (d) => d.rate !== undefined && d.rate !== null,
    );

    const binGenerator = d3
      .bin<EmployeeMetric, number>()
      .thresholds(15)
      .value((d) => d.rate!);
    const computedBins = binGenerator(validData);

    const x = d3
      .scaleLinear()
      .domain([
        computedBins[0]?.x0 ?? 0,
        computedBins[computedBins.length - 1]?.x1 ?? width,
      ])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(computedBins, (d) => d.length) ?? 0])
      .range([height - marginBottom, marginTop]);

    return { bins: computedBins, xScale: x, yScale: y };
  }, [data]);

  useEffect(() => {
    if (!xAxisRef.current || !yAxisRef.current || !xScale || !yScale) return;
    d3.select(xAxisRef.current)
      .transition()
      .duration(800)
      .call(d3.axisBottom(xScale).ticks(10));
    d3.select(yAxisRef.current)
      .transition()
      .duration(800)
      .call(d3.axisLeft(yScale).ticks(5))
      .select(".domain")
      .remove();
  }, [xScale, yScale]);

  if (!xScale || !yScale || bins.length === 0)
    return <div>Generating chart...</div>;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto" }}
    >
      <g fill="#4f46e5">
        {bins.map((d, idx) => {
          if (d.x0 === undefined || d.x1 === undefined) return null;
          const barHeight = Math.max(0, yScale(0) - yScale(d.length));
          return (
            <rect
              key={d.x0}
              x={xScale(d.x0) + 1}
              width={Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)}
              y={yScale(d.length)}
              height={barHeight}
              style={{
                transformOrigin: `${xScale(d.x0)}px ${yScale(0)}px`,
                animation: `growUp 1s ease-out forwards`,
                animationDelay: `${idx * 0.05}s`,
                opacity: 0,
              }}
            />
          );
        })}
      </g>
      <g ref={xAxisRef} transform={`translate(0,${height - marginBottom})`} />
      <g ref={yAxisRef} transform={`translate(${marginLeft},0)`} />
    </svg>
  );
}

// --- 3. Main Landing Page ---
export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        fontFamily: "system-ui, sans-serif",
        color: "#111827",
        minHeight: "100vh",
      }}
    >
      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growUp {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        .animate-hero { animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
          color: "#fff",
          padding: "100px 20px text-align: center",
        }}
        className="animate-hero"
      >
        <div
          style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              marginBottom: "20px",
              letterSpacing: "-1px",
            }}
          >
            The Next Generation of Operations Management
          </h1>
          <p
            style={{
              fontSize: "19px",
              color: "#e0e7ff",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            Empower your team leads with deep data metrics distributions,
            performance modeling, and transparent ecosystem visibility.
          </p>
          <button
            style={{
              backgroundColor: "#fff",
              color: "#4f46e5",
              border: "none",
              padding: "14px 28px",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Explore Infrastructure
          </button>
        </div>
      </section>

      {/* Content Layout Wrapper */}
      <div
        style={{ maxWidth: "1140px", margin: "0 auto", padding: "80px 20px" }}
      >
        {/* Services / Feature Cards */}
        <section
          style={{ marginBottom: "100px" }}
          className="animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "50px",
            }}
          >
            Our Core Competencies
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            {mockDataset.services.map((service) => (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: "#fff",
                  padding: "30px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    hoveredCard === service.id
                      ? "0 12px 24px -10px rgba(0,0,0,0.1)"
                      : "0 4px 6px -1px rgba(0,0,0,0.02)",
                  transform:
                    hoveredCard === service.id
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>
                  {service.icon}
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  {service.title}
                </h3>
                <p style={{ color: "#4b5563", lineHeight: "1.5", margin: 0 }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Live Metrics Visualization Card Component */}
        <section
          style={{ marginBottom: "100px" }}
          className="animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "40px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              Live Efficiency Distribution
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "30px" }}>
              Real-time cluster calculations mapping structural data
              frequencies.
            </p>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <AnimatedChart data={mockDataset.metrics} />
            </div>
          </div>
        </section>

        {/* Corporate Team Grid Section */}
        <section className="animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "50px",
            }}
          >
            Meet the Executives
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "30px",
            }}
          >
            {mockDataset.team.map((member) => (
              <div
                key={member.id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "30px",
                  textAlign: "center",
                  transition: "box-shadow 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.05)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#e0e7ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                    margin: "0 auto 20px auto",
                  }}
                >
                  {member.avatar}
                </div>
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "0 0 4px 0",
                  }}
                >
                  {member.name}
                </h4>
                <p
                  style={{
                    color: "#4f46e5",
                    fontSize: "14px",
                    fontWeight: "500",
                    margin: 0,
                  }}
                >
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
