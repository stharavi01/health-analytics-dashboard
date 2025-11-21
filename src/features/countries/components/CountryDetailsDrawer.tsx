import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import type { Country } from "../types/country.types";
import {
  Activity,
  Skull,
  HeartPulse,
  Users,
  AlertTriangle,
  Microscope,
  TrendingUp,
  Globe,
} from "lucide-react";

interface CountryDetailsDrawerProps {
  country: Country | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Detailed view of country COVID-19 statistics
 */
export function CountryDetailsDrawer({
  country,
  open,
  onOpenChange,
}: CountryDetailsDrawerProps) {
  if (!country) return null;

  const stats = [
    {
      label: "Total Cases",
      value: country.cases,
      today: country.todayCases,
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Deaths",
      value: country.deaths,
      today: country.todayDeaths,
      icon: Skull,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
    {
      label: "Recovered",
      value: country.recovered,
      today: country.todayRecovered,
      icon: HeartPulse,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      label: "Active",
      value: country.active,
      icon: Users,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      label: "Critical",
      value: country.critical,
      icon: AlertTriangle,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      label: "Tests",
      value: country.tests,
      icon: Microscope,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-100 dark:bg-gray-950",
    },
  ];

  const perMillionStats = [
    { label: "Cases per Million", value: country.casesPerOneMillion },
    { label: "Deaths per Million", value: country.deathsPerOneMillion },
    { label: "Tests per Million", value: country.testsPerOneMillion },
    {
      label: "Active per Million",
      value: country.activePerOneMillion || 0,
    },
    {
      label: "Critical per Million",
      value: country.criticalPerOneMillion || 0,
    },
    {
      label: "Recovered per Million",
      value: country.recoveredPerOneMillion || 0,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img
              src={country.countryInfo.flag}
              alt={country.country}
              className="w-12 h-8 object-cover rounded"
            />
            <div>
              <DialogTitle className="text-2xl">{country.country}</DialogTitle>
              <DialogDescription>
                {country.continent} • Population:{" "}
                {country.population.toLocaleString()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Main Statistics Grid */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Main Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className={`text-lg font-bold ${stat.color}`}>
                          {stat.value.toLocaleString()}
                        </p>
                        {stat.today !== undefined && stat.today > 0 && (
                          <p className="text-xs text-muted-foreground">
                            +{stat.today.toLocaleString()} today
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Per Million Statistics */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Per Million Population
            </h3>
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {perMillionStats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-base font-semibold">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Death Rate:</span>
                <span className="ml-2 font-medium">
                  {((country.deaths / country.cases) * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Recovery Rate:</span>
                <span className="ml-2 font-medium">
                  {((country.recovered / country.cases) * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Active Rate:</span>
                <span className="ml-2 font-medium">
                  {((country.active / country.cases) * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Critical Rate:</span>
                <span className="ml-2 font-medium">
                  {((country.critical / country.active) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
