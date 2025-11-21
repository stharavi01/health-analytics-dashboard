import { useMemo } from "react";
import {
  useGetGlobalStatsQuery,
  useGetCountriesQuery,
  useGetGlobalHistoricalQuery,
} from "../countries/api/countriesApi";
import { Card } from "@/components/ui/card";
import { Activity, Skull, HeartPulse, Users } from "lucide-react";
import { KPICard } from "./components/KPICard";
import { TopCountriesChart } from "./components/TopCountriesChart";
import { TrendLineChart } from "./components/TrendLineChart";
import { DistributionPieChart } from "./components/DistributionPieChart";
import { ExportButton } from "./components/ExportButton";
import { LoadingState, ErrorState } from "@/components/common";
import { DateRangeFilter } from "../filters/components/DateRangeFilter";
import { useAppSelector } from "@/store/hooks";
import { selectFilters } from "../filters/filtersSlice";
import { DATE_RANGE_PRESETS } from "@/constants/api.constants";

/**
 * Dashboard Page - Displays global COVID-19 statistics
 */
export function DashboardPage() {
  const filters = useAppSelector(selectFilters);
  const { dateRangePreset } = filters;

  // Calculate days for historical data
  const historicalDays =
    dateRangePreset !== "custom"
      ? DATE_RANGE_PRESETS[dateRangePreset]?.days ?? 30
      : 30;

  // Fetch data
  const {
    data,
    isLoading,
    error,
    refetch: refetchGlobal,
  } = useGetGlobalStatsQuery();

  const { data: countries, refetch: refetchCountries } = useGetCountriesQuery();

  const {
    data: historicalData,
    isLoading: historicalLoading,
    refetch: refetchHistorical,
  } = useGetGlobalHistoricalQuery(historicalDays);

  const filteredCountries = useMemo(() => {
    if (!countries) return [];

    let filtered = [...(countries || [])];

    if (filters.continent !== "All") {
      filtered = filtered.filter((c) => c.continent === filters.continent);
    }

    if (filters.severity !== "All") {
      const getSeverity = (cases: number): "Low" | "Medium" | "High" => {
        if (cases < 100000) return "Low";
        if (cases < 1000000) return "Medium";
        return "High";
      };
      filtered = filtered.filter(
        (c) => getSeverity(c.cases) === filters.severity
      );
    }

    filtered = filtered.filter(
      (c) =>
        c.cases >= filters.casesRange[0] && c.cases <= filters.casesRange[1]
    );

    filtered = filtered.filter(
      (c) =>
        c.deaths >= filters.deathsRange[0] && c.deaths <= filters.deathsRange[1]
    );

    filtered = filtered.filter(
      (c) =>
        c.active >= filters.activeRange[0] && c.active <= filters.activeRange[1]
    );

    filtered = filtered.filter((c) => {
      const recoveryRate = c.recovered > 0 ? (c.recovered / c.cases) * 100 : 0;
      return (
        recoveryRate >= filters.recoveryRateRange[0] &&
        recoveryRate <= filters.recoveryRateRange[1]
      );
    });

    filtered = filtered.filter((c) => {
      const fatalityRate = c.deaths > 0 ? (c.deaths / c.cases) * 100 : 0;
      return (
        fatalityRate >= filters.fatalityRateRange[0] &&
        fatalityRate <= filters.fatalityRateRange[1]
      );
    });

    return filtered;
  }, [countries, filters]);

  const filteredStats = useMemo(() => {
    if (!filteredCountries.length) {
      return {
        cases: 0,
        deaths: 0,
        recovered: 0,
        active: 0,
        todayCases: 0,
        todayDeaths: 0,
        todayRecovered: 0,
      };
    }

    return filteredCountries.reduce(
      (acc, country) => ({
        cases: acc.cases + country.cases,
        deaths: acc.deaths + country.deaths,
        recovered: acc.recovered + country.recovered,
        active: acc.active + country.active,
        todayCases: acc.todayCases + country.todayCases,
        todayDeaths: acc.todayDeaths + country.todayDeaths,
        todayRecovered: acc.todayRecovered + country.todayRecovered,
      }),
      {
        cases: 0,
        deaths: 0,
        recovered: 0,
        active: 0,
        todayCases: 0,
        todayDeaths: 0,
        todayRecovered: 0,
      }
    );
  }, [filteredCountries]);

  const refetchAll = () => {
    refetchGlobal();
    refetchCountries();
    refetchHistorical();
  };

  if (isLoading || historicalLoading) {
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
          onRetry={() => refetchAll()}
        />
      </div>
    );
  }

  if (!data) {
    return <div className="p-6">No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">COVID-19 Global Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Last updated: {new Date(data.updated).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DateRangeFilter />
            <ExportButton
              data={{ countries: filteredCountries, globalStats: data }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Cases"
          value={filteredStats.cases}
          change={filteredStats.todayCases}
          icon={Activity}
          color="blue"
          trend="up"
        />
        <KPICard
          label="Total Deaths"
          value={filteredStats.deaths}
          change={filteredStats.todayDeaths}
          icon={Skull}
          color="red"
          trend="up"
        />
        <KPICard
          label="Total Recovered"
          value={filteredStats.recovered}
          change={filteredStats.todayRecovered}
          icon={HeartPulse}
          color="green"
          trend="up"
        />
        <KPICard
          label="Active Cases"
          value={filteredStats.active}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Chart */}
      <TopCountriesChart countries={filteredCountries} />

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendLineChart data={historicalData} title="Global Trends Over Time" />
        <DistributionPieChart countries={filteredCountries} />
      </div>

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
