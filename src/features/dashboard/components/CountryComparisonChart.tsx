import { useMemo } from "react";
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Country } from "../../countries/types/country.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeCountryFromComparison,
  clearComparison,
  selectFilters,
} from "../../filters/filtersSlice";
import { Badge } from "@/components/ui/badge";

interface CountryComparisonChartProps {
  countries?: Country[];
}

/**
 * Comparison chart for selected countries
 */
export function CountryComparisonChart({
  countries = [],
}: CountryComparisonChartProps) {
  const dispatch = useAppDispatch();
  const { selectedCountriesForComparison } = useAppSelector(selectFilters);

  const chartData = useMemo(() => {
    return selectedCountriesForComparison
      .map((countryName) => {
        const country = countries.find((c) => c.country === countryName);
        if (!country) return null;

        const recoveryRate =
          country.recovered > 0
            ? ((country.recovered / country.cases) * 100).toFixed(2)
            : 0;
        const fatalityRate =
          country.deaths > 0
            ? ((country.deaths / country.cases) * 100).toFixed(2)
            : 0;

        return {
          country: country.country,
          cases: country.cases,
          deaths: country.deaths,
          recovered: country.recovered,
          active: country.active,
          casesPerMillion: country.casesPerOneMillion,
          deathsPerMillion: country.deathsPerOneMillion,
          recoveryRate: parseFloat(recoveryRate as string),
          fatalityRate: parseFloat(fatalityRate as string),
        };
      })
      .filter(Boolean);
  }, [countries, selectedCountriesForComparison]);

  // Don't render anything if no countries are selected
  if (!selectedCountriesForComparison.length) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Country Comparison</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(clearComparison())}
        >
          Clear All
        </Button>
      </div>

      {/* Selected Countries */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedCountriesForComparison.map((country) => (
          <Badge key={country} variant="secondary" className="gap-2">
            {country}
            <button
              onClick={() => dispatch(removeCountryFromComparison(country))}
              className="hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Cases Comparison */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Total Cases</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="country"
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 11 }}
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
            <Bar dataKey="cases" fill="hsl(var(--chart-1))" name="Cases" />
            <Bar dataKey="deaths" fill="hsl(var(--chart-2))" name="Deaths" />
            <Bar
              dataKey="recovered"
              fill="hsl(var(--chart-3))"
              name="Recovered"
            />
            <Bar dataKey="active" fill="hsl(var(--chart-4))" name="Active" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rates Comparison */}
      <div>
        <h3 className="text-sm font-medium mb-2">
          Recovery & Fatality Rates (%)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="country"
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 11 }}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => `${value}%`}
            />
            <Legend />
            <Bar
              dataKey="recoveryRate"
              fill="hsl(var(--chart-3))"
              name="Recovery Rate"
            />
            <Bar
              dataKey="fatalityRate"
              fill="hsl(var(--chart-2))"
              name="Fatality Rate"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
