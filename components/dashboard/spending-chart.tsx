"use client";

import { BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TooltipPayload } from "recharts";
export type SpendingDataPoint = {
  category: string;
  color: string;
  thisMonth: number;
  lastMonth: number;
};

type SpendingChartProps = {
  data: SpendingDataPoint[] | undefined;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background min-w-40 rounded-lg border p-3 text-sm shadow-sm">
      <p className="mb-2 font-medium">{String(label ?? "")}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span
            className="size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: (entry.color as string) ?? "#888" }}
          />
          <span className="text-muted-foreground flex-1">
            {String(entry.name ?? "")}
          </span>
          <span className="font-medium tabular-nums">
            {formatCurrency(Number(entry.value ?? 0))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SpendingChart({ data }: SpendingChartProps) {
  if (!data) return null;

  if (data.length === 0) {
    return (
      <div className="flex h-75 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <BarChart2 className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="text-sm font-medium">No spending data yet</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Start logging expenses to see your category breakdown.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="30%"
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          vertical={false}
        />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          width={72}
        />
        <Tooltip
          content={(props) => <CustomTooltip {...props} />}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          iconType="square"
          iconSize={10}
        />
        <Bar
          dataKey="thisMonth"
          name="This Month"
          fill="#f59e0b"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="lastMonth"
          name="Last Month"
          fill="#94a3b8"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
