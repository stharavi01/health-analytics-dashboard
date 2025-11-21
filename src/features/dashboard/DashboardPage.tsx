import {
  useGetGlobalStatsQuery,
  useGetCountriesQuery,
} from "../countries/api/countriesApi";
import { Card } from "@/components/ui/card";
import { AlertCircle, Activity, Skull, HeartPulse, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "./components/KPICard";
import { TopCountriesChart } from "./components/TopCountriesChart";
import { LoadingState, ErrorState } from "@/components/common";

/**
 * Dashboard Page - Displays global COVID-19 statistics
 */
export function DashboardPage() {
  const { data, isLoading, error, refetch } = useGetGlobalStatsQuery();
  const { data: countries } = useGetCountriesQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">COVID-19 Global Dashboard</h1>
          <p className="text-muted-foreground mt-2">Loading statistics...</p>
        </div>
        <LoadingState type="stats" />
      </div>
    );
  }

  if (error) {
    const errorMessage =
      (error as { userMessage?: string }).userMessage || "Failed to load data";

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">COVID-19 Global Dashboard</h1>
        <ErrorState
          title="Failed to load dashboard data"
          message={errorMessage}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!data) {
    return <div className="p-6">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">COVID-19 Global Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Last updated: {new Date(data.updated).toLocaleString()}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Cases"
          value={data.cases}
          change={data.todayCases}
          icon={Activity}
          color="blue"
          trend="up"
        />
        <KPICard
          label="Total Deaths"
          value={data.deaths}
          change={data.todayDeaths}
          icon={Skull}
          color="red"
          trend="up"
        />
        <KPICard
          label="Total Recovered"
          value={data.recovered}
          change={data.todayRecovered}
          icon={HeartPulse}
          color="green"
          trend="up"
        />
        <KPICard
          label="Active Cases"
          value={data.active}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Chart */}
      <TopCountriesChart countries={countries} />

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Statistics</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Critical:</span>
              <span className="font-medium">
                {data.critical.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tests:</span>
              <span className="font-medium">{data.tests.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Affected Countries:</span>
              <span className="font-medium">{data.affectedCountries}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Per Million Stats</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cases per Million:</span>
              <span className="font-medium">
                {data.casesPerOneMillion.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deaths per Million:</span>
              <span className="font-medium">
                {data.deathsPerOneMillion.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tests per Million:</span>
              <span className="font-medium">
                {data.testsPerOneMillion.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
