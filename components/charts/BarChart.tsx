/**
 * Bar Chart Component
 * Reusable wrapper for Recharts BarChart
 */

"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  bars: Array<{
    dataKey: string;
    fill: string;
    name: string;
  }>;
  height?: number;
}

export function BarChart({ data, xKey, bars, height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} tickMargin={5} />
        <YAxis tick={{ fontSize: 11 }} tickMargin={5} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.fill}
            name={bar.name}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
