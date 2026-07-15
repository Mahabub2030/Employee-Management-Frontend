import React, { useMemo, useRef, useEffect, useState } from "react";

import * as d3 from "d3";

// --- 1. Combined Mock Datasets ---
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
      desc: "Forecast organizational performance indicators and workforce trends.",
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
  testimonials: [
    {
      id: "rev-01",
      quote:
        "Implementing the Vanguard platform fundamentally restructured our timelines. The raw metrics insights saved us over 40 hours a week.",
      author: "Elena Rostova",
      role: "VP of Engineering at CloudScale",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: "rev-02",
      quote:
        "The live data distribution cluster charts are exactly what our team leads needed. The visual patterns expose bottlenecks instantly.",
      author: "Marcus Chen",
      role: "Operations Director at InnovateCorp",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: "rev-03",
      quote:
        "Stunning analytics visuals backed by bulletproof performance data integrity. This interface has become our definitive central command unit.",
      author: "Sarah Jenkins",
      role: "Chief Technology Officer at AlphaData",
      rating: "⭐⭐⭐⭐⭐",
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

// --- 2. D3 Distribution Chart Component (Responsive & Theme Aware) ---
function AnimatedChart({
  data,
  isDarkMode,
}: {
  data: EmployeeMetric[];
  isDarkMode: boolean;
}) {
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

    // Axis line colors adjust smoothly to the active theme context
    const axisColor = isDarkMode ? "#9ca3af" : "#4b5563";

    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    d3.select(xAxisRef.current)
      .transition()
      .duration(400)
      .call(xAxis)
      .style("color", axisColor);
    d3.select(yAxisRef.current)
      .transition()
      .duration(400)
      .call(yAxis)
      .style("color", axisColor)
      .select(".domain")
      .remove();
  }, [xScale, yScale, isDarkMode]);

  if (!xScale || !yScale || bins.length === 0)
    return <div>Generating distribution analytics...</div>;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto" }}
    >
      <g fill={isDarkMode ? "#6366f1" : "#4f46e5"}>
        {" "}
        {/* Dynamic bar color */}
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

// --- 3. Main Exported Landing Page Component ---
export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [hoveredReview, setHoveredReview] = useState<string | null>(null);

  // Theme Styling Configuration
  const theme = {
    bg: isDarkMode ? "#0f172a" : "#f9fafb",
    cardBg: isDarkMode ? "#1e293b" : "#ffffff",
    text: isDarkMode ? "#f8fafc" : "#111827",
    subText: isDarkMode ? "#94a3b8" : "#4b5563",
    border: isDarkMode ? "#334155" : "#e5e7eb",
    shadow: isDarkMode
      ? "0 4px 20px rgba(0,0,0,0.4)"
      : "0 4px 20px rgba(0,0,0,0.03)",
    cardShadowHover: isDarkMode
      ? "0 12px 24px -10px rgba(0,0,0,0.6)"
      : "0 12px 24px -10px rgba(0,0,0,0.1)",
    quoteMark: isDarkMode ? "#334155" : "#e5e7eb",
  };

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        fontFamily: "system-ui, sans-serif",
        color: theme.text,
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* CSS Keyframes Embedded */}
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

      {/* FIXED FLOATING THEME TOGGLE BUTTON */}
      {/* <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 1000,
          backgroundColor: isDarkMode ? "#ffffff" : "#0f172a",
          color: isDarkMode ? "#0f172a" : "#ffffff",
          border: "none",
          padding: "12px 18px",
          borderRadius: "30px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isDarkMode ? "☀️ Light View" : "🌙 Dark View"}
      </button> */}

      {/* HERO SECTION */}
      <section
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #312e81 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
          color: "#fff",
          padding: "120px 20px",
          transition: "background 0.3s ease",
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
              color: isDarkMode ? "#cbd5e1" : "#e0e7ff",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            Empower your team leads with deep data metrics distributions,
            performance modeling, and transparent ecosystem visibility.
          </p>
          <button
            style={{
              backgroundColor: isDarkMode ? "#6366f1" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#4f46e5",
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
            Get Started Safely
          </button>
        </div>
      </section>

      {/* MAIN CONTAINER LAYOUT */}
      <div
        style={{ maxWidth: "1140px", margin: "0 auto", padding: "80px 20px" }}
      >
        {/* SERVICES SECTION */}
        <section style={{ marginBottom: "100px" }} className="animate-fade-up">
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
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  backgroundColor: theme.cardBg,
                  padding: "30px",
                  borderRadius: "12px",
                  border: `1px solid ${theme.border}`,
                  boxShadow:
                    hoveredService === service.id
                      ? theme.cardShadowHover
                      : theme.shadow,
                  transform:
                    hoveredService === service.id
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  transition:
                    "all 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease",
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
                <p
                  style={{ color: theme.subText, lineHeight: "1.5", margin: 0 }}
                >
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE DATA VISUALIZATION SECTION */}
        <section style={{ marginBottom: "100px" }} className="animate-fade-up">
          <div
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: "16px",
              padding: "40px",
              boxShadow: theme.shadow,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
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
            <p style={{ color: theme.subText, marginBottom: "30px" }}>
              Real-time cluster calculations mapping structural data
              frequencies.
            </p>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <AnimatedChart
                data={mockDataset.metrics}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="animate-fade-up" style={{ marginBottom: "100px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "16px",
              }}
            >
              Trusted by Industry Leaders
            </h2>
            <p
              style={{
                color: theme.subText,
                maxWidth: "600px",
                margin: "0 auto",
                fontSize: "16px",
              }}
            >
              See how modern development teams utilize our frequency platforms
              to maximize resource tracking.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "30px",
            }}
          >
            {mockDataset.testimonials.map((review) => (
              <div
                key={review.id}
                onMouseEnter={() => setHoveredReview(review.id)}
                onMouseLeave={() => setHoveredReview(null)}
                style={{
                  backgroundColor: theme.cardBg,
                  padding: "32px",
                  borderRadius: "16px",
                  border: `1px solid ${theme.border}`,
                  boxShadow:
                    hoveredReview === review.id
                      ? theme.cardShadowHover
                      : theme.shadow,
                  transform:
                    hoveredReview === review.id
                      ? "translateY(-6px)"
                      : "translateY(0)",
                  transition:
                    "all 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "24px",
                    fontSize: "64px",
                    color: theme.quoteMark,
                    fontFamily: "Georgia, serif",
                    lineHeight: 1,
                    pointerEvents: "none",
                    transition: "color 0.3s ease",
                  }}
                >
                  “
                </span>
                <div>
                  <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                    {review.rating}
                  </div>
                  <p
                    style={{
                      color: theme.text,
                      fontSize: "15px",
                      lineHeight: "1.6",
                      fontStyle: "italic",
                      margin: "0 0 24px 0",
                    }}
                  >
                    "{review.quote}"
                  </p>
                </div>
                <div
                  style={{
                    borderTop: `1px solid ${theme.border}`,
                    paddingTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: isDarkMode ? "#334155" : "#e0e7ff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      marginRight: "12px",
                      fontWeight: "bold",
                      color: isDarkMode ? "#6366f1" : "#4f46e5",
                    }}
                  >
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        margin: 0,
                        color: theme.text,
                      }}
                    >
                      {review.author}
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        color: theme.subText,
                        margin: 0,
                        marginTop: "2px",
                      }}
                    >
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="animate-fade-up">
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
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "12px",
                  padding: "30px",
                  textAlign: "center",
                  boxShadow: theme.shadow,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = theme.cardShadowHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = theme.shadow)
                }
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: isDarkMode ? "#334155" : "#e0e7ff",
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
                    color: isDarkMode ? "#818cf8" : "#4f46e5",
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
