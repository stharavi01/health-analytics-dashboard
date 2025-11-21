import { useGetCountriesQuery } from "./api/countriesApi";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useDebounce } from "@/hooks/useDebounce";
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
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { CONTINENTS } from "@/constants/api.constants";
import { CountriesTable } from "./components/CountriesTable";
import { TablePagination } from "./components/TablePagination";
import { FilterChips } from "@/features/filters/components/FilterChips";
import { RangeFilter } from "@/features/filters/components/RangeFilter";
import { CountryDetailsDrawer } from "./components/CountryDetailsDrawer";
import type { Country } from "./types/country.types";
import { exportToCSV } from "@/lib/export-csv";
import { toast } from "@/lib/toast";
import { LoadingState, ErrorState } from "@/components/common";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Countries Page - Displays COVID-19 data for all countries with filters
 */
export function CountriesPage() {
  const { data: countries, isLoading, error, refetch } = useGetCountriesQuery();
  const filters = useAppSelector(selectFilters);
  const dispatch = useAppDispatch();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [rangeFiltersOpen, setRangeFiltersOpen] = useState(false);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  const debouncedSearch = useDebounce(filters.search, 300);

  // Scroll to top when page changes
  useEffect(() => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollTop = 0;
    }
  }, [filters.currentPage]);

  // Calculate min/max values for range filters
  const rangeStats = useMemo(() => {
    if (!countries || countries.length === 0)
      return { maxCases: 100000000, maxDeaths: 10000000, maxActive: 50000000 };

    const maxCases = Math.max(...countries.map((c: Country) => c.cases));
    const maxDeaths = Math.max(...countries.map((c: Country) => c.deaths));
    const maxActive = Math.max(...countries.map((c: Country) => c.active));

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
    } catch {
      toast.error("Failed to export data");
    }
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    dispatch(resetFilters());
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Countries Data</h1>
        <Card className="p-6">
          <LoadingState type="table" rows={10} columns={8} />
        </Card>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      (error as { userMessage?: string }).userMessage ||
      "Failed to load countries";

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Countries Data</h1>
        <ErrorState
          title="Failed to load countries data"
          message={errorMessage}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Countries Data</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {filteredCountries.length} of {countries?.length || 0}{" "}
            countries
          </p>
        </div>
        {/* Export button - desktop only */}
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="hidden sm:flex"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Compact Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          {/* Top row - Search and primary filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Search - takes more space on desktop */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search countries..."
                value={filters.search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="pl-10"
              />
            </div>

            {/* Filter controls - compact row */}
            <div className="flex gap-2 sm:gap-3 flex-nowrap">
              <Select
                value={filters.continent}
                onValueChange={(value) =>
                  dispatch(setContinent(value as typeof filters.continent))
                }
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Continent" />
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
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>

              {/* Range Filters Sheet */}
              <Sheet open={rangeFiltersOpen} onOpenChange={setRangeFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="default"
                    className="relative shrink-0"
                  >
                    <Filter className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Ranges</span>
                    {activeFilterChips.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {activeFilterChips.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[350px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Range Filters</SheetTitle>
                    <SheetDescription>
                      Adjust ranges to filter countries by cases, deaths, and
                      active cases.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
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
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleClearAllFilters}
                        size="sm"
                      >
                        Reset All
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => setRangeFiltersOpen(false)}
                        size="sm"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Export button - mobile only, icon-only */}
              <Button
                onClick={handleExport}
                variant="outline"
                size="icon"
                className="sm:hidden shrink-0"
                title="Export CSV"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
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
      <Card className="overflow-hidden flex flex-col h-[calc(100vh-20rem)]">
        <div ref={tableScrollRef} className="overflow-auto flex-1">
          <CountriesTable
            countries={filteredCountries}
            currentPage={filters.currentPage}
            itemsPerPage={filters.itemsPerPage}
            onRowClick={(country) => setSelectedCountry(country)}
          />
        </div>
        <div className="border-t bg-card">
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
