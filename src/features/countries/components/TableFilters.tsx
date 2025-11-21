import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setSearch,
  setContinent,
  resetFilters,
} from "@/features/filters/filtersSlice";
import { CONTINENTS } from "@/constants/api.constants";
import { useEffect, useState } from "react";

/**
 * Table filters component with search and continent filter
 */
export function TableFilters() {
  const dispatch = useAppDispatch();
  const { search, continent } = useAppSelector((state) => state.filters);

  // Local state for debounced search
  const [searchInput, setSearchInput] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearch(searchInput));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const handleContinentChange = (value: string) => {
    dispatch(setContinent(value));
  };

  const handleReset = () => {
    setSearchInput("");
    dispatch(resetFilters());
  };

  const hasActiveFilters = search !== "" || continent !== "All";

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search countries..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Continent Filter */}
      <Select value={continent} onValueChange={handleContinentChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Select continent" />
        </SelectTrigger>
        <SelectContent>
          {CONTINENTS.map((cont) => (
            <SelectItem key={cont} value={cont}>
              {cont}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
}
