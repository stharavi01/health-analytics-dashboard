import { useGetCountriesQuery } from "./api/countriesApi";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  setSearch,
  setContinent,
  setCurrentPage,
  setItemsPerPage,
  selectFilters,
} from "@/features/filters/filtersSlice";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search } from "lucide-react";
import { useMemo } from "react";
import { CONTINENTS } from "@/constants/api.constants";
import { CountriesTable } from "./components/CountriesTable";
import { TablePagination } from "./components/TablePagination";

/**
 * Countries Page - Displays COVID-19 data for all countries with filters
 */
export function CountriesPage() {
  const { data: countries, isLoading, error, refetch } = useGetCountriesQuery();
  const filters = useAppSelector(selectFilters);
  const dispatch = useAppDispatch();

  // Filter and sort countries
  const filteredCountries = useMemo(() => {
    if (!countries) return [];

    let filtered = [...countries];

    // Apply continent filter
    if (filters.continent !== "All") {
      filtered = filtered.filter((c) => c.continent === filters.continent);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((c) =>
        c.country.toLowerCase().includes(searchLower)
      );
    }

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
  }, [countries, filters]);

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
      <div>
        <h1 className="text-3xl font-bold">Countries Data</h1>
        <p className="text-muted-foreground mt-2">
          Showing {filteredCountries.length} of {countries?.length || 0}{" "}
          countries
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
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
            {CONTINENTS.map((continent) => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <CountriesTable
          countries={filteredCountries}
          currentPage={filters.currentPage}
          itemsPerPage={filters.itemsPerPage}
        />
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
      </Card>
    </div>
  );
}
