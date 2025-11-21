import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { GlobalHistoricalData } from "../../countries/types/country.types";

interface TrendLineChartProps {
  data?: GlobalHistoricalData;
  title?: string;
}

/**
 * Line chart showing COVID-19 trends over time
 */
export function TrendLineChart({
  data,
  title = "Global Trends",
}: TrendLineChartProps) {
  const chartData = useMemo(() => {
    if (!data || !data.cases) return [];

    const dates = Object.keys(data.cases);
    return dates.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      cases: data.cases[date],
      deaths: data.deaths[date],
      recovered: data.recovered[date],
    }));
  }, [data]);

  if (!chartData.length) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground text-center py-8">
          No historical data available
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            formatter={(value: number) => value.toLocaleString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="cases"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
            name="Cases"
          />
          <Line
            type="monotone"
            dataKey="deaths"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
            name="Deaths"
          />
          <Line
            type="monotone"
            dataKey="recovered"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={false}
            name="Recovered"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
