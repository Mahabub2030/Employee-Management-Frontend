import React, { useMemo, useRef, useEffect } from "react";
import * as d3 from "d3";

// 1. Static mock data source
const mockJsonData = {
  unemploymentData: [
    { rate: 4.2 },
    { rate: 4.5 },
    { rate: 5.1 },
    { rate: 3.8 },
    { rate: 6.2 },
    { rate: 4.5 },
    { rate: 5.3 },
    { rate: 4.1 },
    { rate: null },
    { rate: 3.9 },
    { rate: 4.8 },
    { rate: 5.0 },
  ],
};

export interface UnemploymentData {
  rate?: number | null;
  [key: string]: any;
}

interface AnalyticsProps {
  data: UnemploymentData[];
}

// --- The D3 Chart Sub-Component ---
function Chart({ data }: AnalyticsProps) {
  const width = 960;
  const height = 500;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);

  const { bins, xScale, yScale } = useMemo(() => {
    if (!data || data.length === 0)
      return { bins: [], xScale: null, yScale: null };

    // Filter out missing/undefined records completely
    const validData = data.filter(
      (d) => d.rate !== undefined && d.rate !== null,
    );

    if (validData.length === 0) return { bins: [], xScale: null, yScale: null };

    const binGenerator = d3
      .bin<UnemploymentData, number>()
      .thresholds(40)
      .value((d) => d.rate!);

    const computedBins = binGenerator(validData);

    const firstX0 = computedBins[0]?.x0 ?? 0;
    const lastX1 = computedBins[computedBins.length - 1]?.x1 ?? width;

    const x = d3
      .scaleLinear()
      .domain([firstX0, lastX1])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(computedBins, (d) => d.length) ?? 0])
      .range([height - marginBottom, marginTop]);

    return { bins: computedBins, xScale: x, yScale: y };
  }, [data]);

  useEffect(() => {
    if (!xAxisRef.current || !yAxisRef.current || !xScale || !yScale) return;

    d3.select(xAxisRef.current).call(
      d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickSizeOuter(0),
    );

    d3.select(yAxisRef.current)
      .call(d3.axisLeft(yScale).ticks(height / 40))
      .select(".domain")
      .remove();
  }, [xScale, yScale]);

  if (!data || data.length === 0 || bins.length === 0 || !xScale || !yScale) {
    return <div style={{ padding: "20px" }}>Awaiting clean chart data...</div>;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <g fill="steelblue">
        {bins.map((d) => {
          if (d.x0 === undefined || d.x1 === undefined) return null;
          return (
            <rect
              key={d.x0}
              x={xScale(d.x0) + 1}
              width={Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)}
              y={yScale(d.length)}
              height={Math.max(0, yScale(0) - yScale(d.length))}
            />
          );
        })}
      </g>
      <g ref={xAxisRef} transform={`translate(0,${height - marginBottom})`}>
        <text
          x={width}
          y={marginBottom - 4}
          fill="currentColor"
          textAnchor="end"
        >
          Unemployment rate (%) →
        </text>
      </g>
      <g ref={yAxisRef} transform={`translate(${marginLeft},0)`}>
        <text x={-marginLeft} y={10} fill="currentColor" textAnchor="start">
          ↑ Frequency (no. of counties)
        </text>
      </g>
    </svg>
  );
}

// --- Main Exported Analytics Page Component ---
export default function AnalyticsPage() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ marginBottom: "8px" }}>Analytics Overview</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Visualizing data frequencies from county distribution records.
      </p>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e4e4e7",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <Chart data={mockJsonData.unemploymentData} />
      </div>
    </div>
  );
}
