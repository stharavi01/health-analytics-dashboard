import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { Country } from "../../countries/types/country.types";

interface TopCountriesChartProps {
  countries?: Country[];
  limit?: number;
}

/**
 * Bar chart showing top countries by COVID-19 cases
 */
export function TopCountriesChart({
  countries = [],
  limit = 10,
}: TopCountriesChartProps) {
  const chartData = useMemo(() => {
    return countries
      .slice()
      .sort((a, b) => b.cases - a.cases)
      .slice(0, limit)
      .map((country) => ({
        name: country.country,
        cases: country.cases,
        deaths: country.deaths,
        recovered: country.recovered,
      }));
  }, [countries, limit]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Top {limit} Countries by Cases
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            className="text-xs fill-muted-foreground"
          />
          <YAxis className="text-xs fill-muted-foreground" width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            formatter={(value: number) => value.toLocaleString()}
          />
          <Bar
            dataKey="cases"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
