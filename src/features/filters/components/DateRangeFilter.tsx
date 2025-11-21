import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setDateRangePreset, selectFilters } from "../filtersSlice";
import {
  DATE_RANGE_PRESETS,
  type DateRangePreset,
} from "@/constants/api.constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

/**
 * Date Range Filter Component
 * Allows users to select predefined date ranges or custom dates
 */
export function DateRangeFilter() {
  const dispatch = useAppDispatch();
  const { dateRangePreset } = useAppSelector(selectFilters);

  const handlePresetChange = (value: string) => {
    if (value === "custom") {
      dispatch(setDateRangePreset("custom"));
    } else {
      dispatch(setDateRangePreset(value as DateRangePreset));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={dateRangePreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(DATE_RANGE_PRESETS).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
