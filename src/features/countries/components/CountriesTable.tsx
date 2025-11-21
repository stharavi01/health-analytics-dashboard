import { useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleSortDirection } from "@/features/filters/filtersSlice";
import { Country, SortField } from "../types/country.types";
import { formatNumber } from "@/lib/utils";

interface CountriesTableProps {
  countries: Country[];
}

/**
 * Countries table with sorting
 */
export function CountriesTable({ countries }: CountriesTableProps) {
  const dispatch = useAppDispatch();
  const { search, continent, sortField, sortDirection, page, pageSize } =
    useAppSelector((state) => state.filters);

  // Filter and sort countries
  const filteredAndSortedCountries = useMemo(() => {
    let filtered = [...countries];

    // Apply search filter
    if (search) {
      filtered = filtered.filter((country) =>
        country.country.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply continent filter
    if (continent !== "All") {
      filtered = filtered.filter((country) => country.continent === continent);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [countries, search, continent, sortField, sortDirection]);

  // Paginate
  const paginatedCountries = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredAndSortedCountries.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedCountries, page, pageSize]);

  const handleSort = (field: SortField) => {
    dispatch(toggleSortDirection(field));
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("country")}
                className="hover:bg-transparent p-0 h-auto font-semibold"
              >
                Country
                {getSortIcon("country")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("cases")}
                className="hover:bg-transparent p-0 h-auto font-semibold ml-auto flex"
              >
                Cases
                {getSortIcon("cases")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("deaths")}
                className="hover:bg-transparent p-0 h-auto font-semibold ml-auto flex"
              >
                Deaths
                {getSortIcon("deaths")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("recovered")}
                className="hover:bg-transparent p-0 h-auto font-semibold ml-auto flex"
              >
                Recovered
                {getSortIcon("recovered")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("active")}
                className="hover:bg-transparent p-0 h-auto font-semibold ml-auto flex"
              >
                Active
                {getSortIcon("active")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("critical")}
                className="hover:bg-transparent p-0 h-auto font-semibold ml-auto flex"
              >
                Critical
                {getSortIcon("critical")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("tests")}
                className="hover:bg-transparent p-0 h-auto font-semibold ml-auto flex"
              >
                Tests
                {getSortIcon("tests")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("population")}
                className="hover:bg-transparent p-0 h-auto font-semibold ml-auto flex"
              >
                Population
                {getSortIcon("population")}
              </Button>
            </TableHead>
            <TableHead>Continent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCountries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-8 text-muted-foreground"
              >
                No countries found
              </TableCell>
            </TableRow>
          ) : (
            paginatedCountries.map((country, index) => (
              <TableRow key={country.country}>
                <TableCell className="font-medium">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={country.countryInfo.flag}
                      alt={country.country}
                      className="w-6 h-4 object-cover rounded"
                    />
                    <span className="font-medium">{country.country}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(country.cases)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(country.deaths)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(country.recovered)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(country.active)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(country.critical)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(country.tests)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(country.population)}
                </TableCell>
                <TableCell>{country.continent}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
