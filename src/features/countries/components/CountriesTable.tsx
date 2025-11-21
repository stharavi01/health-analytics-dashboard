import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Country } from "../types/country.types";
import { toast } from "@/lib/toast";

interface CountriesTableProps {
  countries: Country[];
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Enhanced countries table with copy-to-clipboard, sticky columns, and more data
 */
export function CountriesTable({
  countries,
  currentPage,
  itemsPerPage,
}: CountriesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCountries = countries.slice(startIndex, endIndex);

  const handleCopy = async (country: Country) => {
    try {
      const data = {
        country: country.country,
        cases: country.cases,
        deaths: country.deaths,
        recovered: country.recovered,
        active: country.active,
      };
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopiedId(country.country);
      toast.success("Data copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium sticky left-0 bg-muted z-20">
              Country
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium">Cases</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Today</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Deaths</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Today</th>
            <th className="px-4 py-3 text-right text-sm font-medium">
              Recovered
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium">Active</th>
            <th className="px-4 py-3 text-right text-sm font-medium">
              Critical
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium">Tests</th>
            <th className="px-4 py-3 text-center text-sm font-medium w-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {paginatedCountries.map((country) => (
            <tr
              key={country.country}
              className="hover:bg-muted/50 transition-colors group"
            >
              <td className="px-4 py-3 sticky left-0 bg-card group-hover:bg-muted/50 transition-colors z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2">
                  <img
                    src={country.countryInfo.flag}
                    alt={country.country}
                    className="w-6 h-4 object-cover rounded"
                  />
                  <span className="font-medium whitespace-nowrap">
                    {country.country}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">
                {country.cases.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-blue-600 dark:text-blue-400">
                +{country.todayCases.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-mono text-red-600 dark:text-red-400">
                {country.deaths.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-red-600 dark:text-red-400">
                +{country.todayDeaths.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-mono text-green-600 dark:text-green-400">
                {country.recovered.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-mono text-orange-600 dark:text-orange-400">
                {country.active.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-mono text-purple-600 dark:text-purple-400">
                {country.critical.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-600 dark:text-gray-400">
                {country.tests.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleCopy(country)}
                  className={cn(
                    "p-2 rounded-md transition-colors hover:bg-accent",
                    "opacity-0 md:group-hover:opacity-100 md:opacity-100"
                  )}
                  aria-label="Copy country data"
                  title="Copy data to clipboard"
                >
                  {copiedId === country.country ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
