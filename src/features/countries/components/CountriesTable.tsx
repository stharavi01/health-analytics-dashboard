import { useState, memo } from "react";
import { Copy, Check, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Country } from "../types/country.types";
import { toast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setSort, selectFilters } from "@/features/filters/filtersSlice";

interface CountriesTableProps {
  countries: Country[];
  currentPage: number;
  itemsPerPage: number;
  onRowClick?: (country: Country) => void;
}

/**
 * Memoized table row component for performance optimization
 */
interface CountryRowProps {
  country: Country;
  onCopy: (country: Country, e: React.MouseEvent) => void;
  onClick?: (country: Country) => void;
  copiedId: string | null;
}

const CountryRow = memo(function CountryRow({
  country,
  onCopy,
  onClick,
  copiedId,
}: CountryRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(country);
    }
  };

  return (
    <tr
      className="hover:bg-muted/50 transition-colors group cursor-pointer"
      onClick={() => onClick?.(country)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${country.country}`}
    >
      <td className="px-4 py-3 sticky left-0 bg-card group-hover:bg-muted/50 transition-colors z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <img
            src={country.countryInfo.flag}
            alt={`${country.country} flag`}
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
          onClick={(e) => onCopy(country, e)}
          className={cn(
            "p-2 rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "opacity-0 md:group-hover:opacity-100 md:opacity-100"
          )}
          aria-label={`Copy ${country.country} data to clipboard`}
          title="Copy data to clipboard"
        >
          {copiedId === country.country ? (
            <Check className="h-4 w-4 text-green-600" aria-label="Copied" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" aria-label="Copy" />
          )}
        </button>
      </td>
    </tr>
  );
});

/**
 * Sort icon component (outside render to avoid recreation)
 */
interface SortIconProps {
  column: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

function SortIcon({ column, sortBy, sortOrder }: SortIconProps) {
  if (sortBy !== column) {
    return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
  }
  return sortOrder === "desc" ? (
    <ArrowDown className="h-3 w-3 ml-1" />
  ) : (
    <ArrowUp className="h-3 w-3 ml-1" />
  );
}

/**
 * Enhanced countries table with copy-to-clipboard, sticky columns, and more data
 */
export function CountriesTable({
  countries,
  currentPage,
  itemsPerPage,
  onRowClick,
}: CountriesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCountries = countries.slice(startIndex, endIndex);

  const handleCopy = async (country: Country, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleSort = (column: typeof filters.sortBy) => {
    const newOrder =
      filters.sortBy === column && filters.sortOrder === "desc"
        ? "asc"
        : "desc";
    dispatch(setSort({ sortBy: column, sortOrder: newOrder }));
  };

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full"
        role="table"
        aria-label="Countries COVID-19 data table"
      >
        <thead className="bg-muted sticky top-0 z-10">
          <tr>
            <th
              className="px-4 py-3 text-left text-sm font-medium sticky left-0 bg-muted z-20 cursor-pointer hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => handleSort("country")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSort("country");
                }
              }}
              tabIndex={0}
              aria-sort={
                filters.sortBy === "country"
                  ? filters.sortOrder === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <div className="flex items-center">
                Country
                <SortIcon
                  column="country"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                />
              </div>
            </th>
            <th
              className="px-4 py-3 text-right text-sm font-medium cursor-pointer hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => handleSort("cases")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSort("cases");
                }
              }}
              tabIndex={0}
              aria-sort={
                filters.sortBy === "cases"
                  ? filters.sortOrder === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <div className="flex items-center justify-end">
                Cases
                <SortIcon
                  column="cases"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                />
              </div>
            </th>
            <th
              className="px-4 py-3 text-right text-sm font-medium cursor-pointer hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => handleSort("todayCases")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSort("todayCases");
                }
              }}
              tabIndex={0}
              aria-sort={
                filters.sortBy === "todayCases"
                  ? filters.sortOrder === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <div className="flex items-center justify-end">
                Today
                <SortIcon
                  column="todayCases"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                />
              </div>
            </th>
            <th
              className="px-4 py-3 text-right text-sm font-medium cursor-pointer hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => handleSort("deaths")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSort("deaths");
                }
              }}
              tabIndex={0}
              aria-sort={
                filters.sortBy === "deaths"
                  ? filters.sortOrder === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <div className="flex items-center justify-end">
                Deaths
                <SortIcon
                  column="deaths"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                />
              </div>
            </th>
            <th
              className="px-4 py-3 text-right text-sm font-medium cursor-pointer hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => handleSort("todayDeaths")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSort("todayDeaths");
                }
              }}
              tabIndex={0}
              aria-sort={
                filters.sortBy === "todayDeaths"
                  ? filters.sortOrder === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <div className="flex items-center justify-end">
                Today
                <SortIcon
                  column="todayDeaths"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                />
              </div>
            </th>
            <th
              className="px-4 py-3 text-right text-sm font-medium cursor-pointer hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => handleSort("recovered")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSort("recovered");
                }
              }}
              tabIndex={0}
              aria-sort={
                filters.sortBy === "recovered"
                  ? filters.sortOrder === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <div className="flex items-center justify-end">
                Recovered
                <SortIcon
                  column="recovered"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                />
              </div>
            </th>
            <th
              className="px-4 py-3 text-right text-sm font-medium cursor-pointer hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => handleSort("active")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSort("active");
                }
              }}
              tabIndex={0}
              aria-sort={
                filters.sortBy === "active"
                  ? filters.sortOrder === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <div className="flex items-center justify-end">
                Active
                <SortIcon
                  column="active"
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                />
              </div>
            </th>
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
            <CountryRow
              key={country.country}
              country={country}
              onCopy={handleCopy}
              onClick={onRowClick}
              copiedId={copiedId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
