"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
} from "recharts";
import { formatINR } from "@/utils/format";

const PIE_COLORS = [
  "var(--accent)",
  "var(--accent-2)",
  "var(--warn)",
  "#7C3AED",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
  "#F59E0B",
];

const RISK_COLORS = { Low: "var(--accent)", Medium: "var(--warn)", High: "var(--danger)" };

function ChartCard({ title, subtitle, children, height = 280 }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      <div style={{ width: "100%", height }}>{children}</div>
    </div>
  );
}

function tooltipStyle() {
  return {
    contentStyle: {
      background: "var(--surface-raised)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      fontSize: 12,
      color: "var(--text)",
    },
    labelStyle: { color: "var(--text-muted)" },
  };
}

export function InvestmentGrowthChart({ data }) {
  return (
    <ChartCard title="Investment growth" subtitle="Aggregate capital raised across all deals, month over month">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid-line)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatINR(v)}
            width={64}
          />
          <Tooltip {...tooltipStyle()} formatter={(v) => formatINR(v)} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function IndustryDistributionChart({ data }) {
  return (
    <ChartCard title="Industry distribution" subtitle="Share of active deals by sector">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="industry"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            animationDuration={800}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="var(--surface)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle()} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }}
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RiskVsRoiChart({ data }) {
  return (
    <ChartCard title="Risk vs ROI" subtitle="Every deal plotted by projected ROI and risk tier" height={300}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid-line)" />
          <XAxis
            type="category"
            dataKey="risk"
            allowDuplicatedCategory={false}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="roi"
            name="ROI"
            unit="%"
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip {...tooltipStyle()} cursor={{ strokeDasharray: "3 3" }} />
          {["Low", "Medium", "High"].map((risk) => (
            <Scatter
              key={risk}
              name={risk}
              data={data.filter((d) => d.risk === risk)}
              fill={RISK_COLORS[risk]}
              animationDuration={800}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }} iconSize={8} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RoiProjectionChart({ data }) {
  return (
    <ChartCard title="ROI projection" subtitle="Projected return by year, if the round closes as planned" height={240}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid-line)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={44}
          />
          <Tooltip {...tooltipStyle()} formatter={(v) => `${v}%`} />
          <Line
            type="monotone"
            dataKey="projected"
            stroke="var(--accent-2)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--accent-2)" }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function FundingBarChart({ data, dataKey = "total", nameKey = "industry", title, subtitle }) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid-line)" vertical={false} />
          <XAxis
            dataKey={nameKey}
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatINR(v)}
            width={64}
          />
          <Tooltip {...tooltipStyle()} formatter={(v) => formatINR(v)} />
          <Bar dataKey={dataKey} fill="var(--accent-2)" radius={[6, 6, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
