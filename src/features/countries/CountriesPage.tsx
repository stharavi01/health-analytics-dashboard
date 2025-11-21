import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { useGetCountriesQuery } from "./api/countriesApi";
import { TableFilters } from "./components/TableFilters";
import { CountriesTable } from "./components/CountriesTable";
import { TablePagination } from "./components/TablePagination";
import { TableSkeleton } from "./components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";

/**
 * Countries page - displays sortable/filterable table of country data
 */
export function CountriesPage() {
  const { data: countries, isLoading, error, refetch } = useGetCountriesQuery();
  const { search, continent } = useAppSelector((state) => state.filters);

  // Calculate filtered count for pagination
  const filteredCount = useMemo(() => {
    if (!countries) return 0;

    let filtered = [...countries];

    if (search) {
      filtered = filtered.filter((country) =>
        country.country.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (continent !== "All") {
      filtered = filtered.filter((country) => country.continent === continent);
    }

    return filtered.length;
  }, [countries, search, continent]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Countries COVID-19 Data
        </h2>
        <TableSkeleton />
      </div>
    );
  }

  if (error || !countries) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Countries COVID-19 Data
        </h2>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load data</h3>
          <p className="text-muted-foreground mb-4">
            Unable to fetch countries data. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">
        Countries COVID-19 Data
      </h2>

      <TableFilters />
      <CountriesTable countries={countries} />
      <TablePagination totalItems={filteredCount} />
    </div>
  );
}
