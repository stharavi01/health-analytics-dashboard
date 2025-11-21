import { useGetCountriesQuery } from "./api/countriesApi";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useDebounce } from "@/app/hooks/useDebounce";
import {
  setSearch,
  setContinent,
  setSeverity,
  setCasesRange,
  setDeathsRange,
  setActiveRange,
  setCurrentPage,
  setItemsPerPage,
  selectFilters,
  resetFilters,
} from "@/features/filters/filtersSlice";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, Download, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { CONTINENTS } from "@/constants/api.constants";
import { CountriesTable } from "./components/CountriesTable";
import { TablePagination } from "./components/TablePagination";
import { FilterChips } from "@/features/filters/components/FilterChips";
import { RangeFilter } from "@/features/filters/components/RangeFilter";
import { CountryDetailsDrawer } from "./components/CountryDetailsDrawer";
import type { Country } from "./types/country.types";
import { exportToCSV } from "@/lib/export-csv";
import { toast } from "@/lib/toast";

/**
 * Countries Page - Displays COVID-19 data for all countries with filters
 */
export function CountriesPage() {
  const { data: countries, isLoading, error, refetch } = useGetCountriesQuery();
  const filters = useAppSelector(selectFilters);
  const dispatch = useAppDispatch();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounce search input
  const debouncedSearch = useDebounce(filters.search, 300);

  // Calculate min/max values for range filters
  const rangeStats = useMemo(() => {
    if (!countries || countries.length === 0)
      return { maxCases: 100000000, maxDeaths: 10000000, maxActive: 50000000 };

    const maxCases = Math.max(...countries.map((c) => c.cases));
    const maxDeaths = Math.max(...countries.map((c) => c.deaths));
    const maxActive = Math.max(...countries.map((c) => c.active));

    return { maxCases, maxDeaths, maxActive };
  }, [countries]);

  // Get severity category for a country
  const getSeverity = (cases: number): "Low" | "Medium" | "High" => {
    if (cases < 100000) return "Low";
    if (cases < 1000000) return "Medium";
    return "High";
  };

  // Filter and sort countries
  const filteredCountries = useMemo(() => {
    if (!countries) return [];

    let filtered = [...countries];

    // Apply continent filter
    if (filters.continent !== "All") {
      filtered = filtered.filter((c) => c.continent === filters.continent);
    }

    // Apply search filter (debounced)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((c) =>
        c.country.toLowerCase().includes(searchLower)
      );
    }

    // Apply severity filter
    if (filters.severity !== "All") {
      filtered = filtered.filter(
        (c) => getSeverity(c.cases) === filters.severity
      );
    }

    // Apply cases range filter
    filtered = filtered.filter(
      (c) =>
        c.cases >= filters.casesRange[0] && c.cases <= filters.casesRange[1]
    );

    // Apply deaths range filter
    filtered = filtered.filter(
      (c) =>
        c.deaths >= filters.deathsRange[0] && c.deaths <= filters.deathsRange[1]
    );

    // Apply active range filter
    filtered = filtered.filter(
      (c) =>
        c.active >= filters.activeRange[0] && c.active <= filters.activeRange[1]
    );

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return filters.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const numA = Number(aValue) || 0;
      const numB = Number(bValue) || 0;
      return filters.sortOrder === "asc" ? numA - numB : numB - numA;
    });

    return filtered;
  }, [countries, filters, debouncedSearch]);

  // Get active filter chips
  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.continent !== "All") {
      chips.push({
        id: "continent",
        label: "Continent",
        value: filters.continent,
        onRemove: () => dispatch(setContinent("All")),
      });
    }

    if (filters.severity !== "All") {
      chips.push({
        id: "severity",
        label: "Severity",
        value: filters.severity,
        onRemove: () => dispatch(setSeverity("All")),
      });
    }

    if (
      filters.casesRange[0] !== 0 ||
      filters.casesRange[1] !== rangeStats.maxCases
    ) {
      chips.push({
        id: "cases",
        label: "Cases",
        value: `${filters.casesRange[0].toLocaleString()} - ${filters.casesRange[1].toLocaleString()}`,
        onRemove: () => dispatch(setCasesRange([0, rangeStats.maxCases])),
      });
    }

    if (
      filters.deathsRange[0] !== 0 ||
      filters.deathsRange[1] !== rangeStats.maxDeaths
    ) {
      chips.push({
        id: "deaths",
        label: "Deaths",
        value: `${filters.deathsRange[0].toLocaleString()} - ${filters.deathsRange[1].toLocaleString()}`,
        onRemove: () => dispatch(setDeathsRange([0, rangeStats.maxDeaths])),
      });
    }

    if (
      filters.activeRange[0] !== 0 ||
      filters.activeRange[1] !== rangeStats.maxActive
    ) {
      chips.push({
        id: "active",
        label: "Active",
        value: `${filters.activeRange[0].toLocaleString()} - ${filters.activeRange[1].toLocaleString()}`,
        onRemove: () => dispatch(setActiveRange([0, rangeStats.maxActive])),
      });
    }

    return chips;
  }, [filters, rangeStats, dispatch]);

  // Handle CSV export
  const handleExport = () => {
    try {
      exportToCSV(
        filteredCountries,
        `covid-data-${new Date().toISOString().split("T")[0]}.csv`
      );
      toast.success(`Exported ${filteredCountries.length} countries to CSV`);
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    dispatch(resetFilters());
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Countries Data</h1>
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      (error as { userMessage?: string }).userMessage ||
      "Failed to load countries";

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Countries Data</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="text-destructive font-semibold mb-2">
                {errorMessage}
              </p>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Countries Data</h1>
          <p className="text-muted-foreground mt-2">
            Showing {filteredCountries.length} of {countries?.length || 0}{" "}
            countries
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Basic Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search countries..."
                value={filters.search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.continent}
              onValueChange={(value) =>
                dispatch(setContinent(value as typeof filters.continent))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select continent" />
              </SelectTrigger>
              <SelectContent>
                {CONTINENTS.map((continent) => (
                  <SelectItem key={continent} value={continent}>
                    {continent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.severity}
              onValueChange={(value) =>
                dispatch(setSeverity(value as typeof filters.severity))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Severity</SelectItem>
                <SelectItem value="Low">Low (&lt; 100k)</SelectItem>
                <SelectItem value="Medium">Medium (100k - 1M)</SelectItem>
                <SelectItem value="High">High (&gt; 1M)</SelectItem>
              </SelectContent>
            </Select>
            <Sheet
              open={showAdvancedFilters}
              onOpenChange={setShowAdvancedFilters}
            >
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                  <SheetDescription>
                    Fine-tune your data with range filters
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <RangeFilter
                    label="Cases Range"
                    min={0}
                    max={rangeStats.maxCases}
                    value={filters.casesRange}
                    onChange={(value) => dispatch(setCasesRange(value))}
                  />
                  <RangeFilter
                    label="Deaths Range"
                    min={0}
                    max={rangeStats.maxDeaths}
                    value={filters.deathsRange}
                    onChange={(value) => dispatch(setDeathsRange(value))}
                  />
                  <RangeFilter
                    label="Active Cases Range"
                    min={0}
                    max={rangeStats.maxActive}
                    value={filters.activeRange}
                    onChange={(value) => dispatch(setActiveRange(value))}
                  />
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleClearAllFilters}
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Filter Chips */}
          {activeFilterChips.length > 0 && (
            <div className="pt-2 border-t">
              <FilterChips
                filters={activeFilterChips}
                onClearAll={handleClearAllFilters}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Table with sticky pagination */}
      <Card className="overflow-hidden flex flex-col max-h-[calc(100vh-20rem)]">
        <div className="overflow-auto flex-1">
          <CountriesTable
            countries={filteredCountries}
            currentPage={filters.currentPage}
            itemsPerPage={filters.itemsPerPage}
            onRowClick={(country) => setSelectedCountry(country)}
          />
        </div>
        <div className="sticky bottom-0 bg-card border-t">
          <TablePagination
            currentPage={filters.currentPage}
            totalPages={Math.ceil(
              filteredCountries.length / filters.itemsPerPage
            )}
            itemsPerPage={filters.itemsPerPage}
            totalItems={filteredCountries.length}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
            onItemsPerPageChange={(items) => dispatch(setItemsPerPage(items))}
          />
        </div>
      </Card>

      {/* Country Details Drawer */}
      <CountryDetailsDrawer
        country={selectedCountry}
        open={!!selectedCountry}
        onOpenChange={(open) => !open && setSelectedCountry(null)}
      />
    </div>
  );
}
