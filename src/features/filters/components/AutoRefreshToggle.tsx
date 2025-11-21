import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleAutoRefresh,
  setRefreshInterval,
  selectFilters,
} from "../filtersSlice";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

/**
 * Auto Refresh Toggle Component
 * Allows users to enable/disable auto-refresh and set the interval
 */
export function AutoRefreshToggle() {
  const dispatch = useAppDispatch();
  const { autoRefresh, refreshInterval } = useAppSelector(selectFilters);

  const intervals = [
    { label: "30 seconds", value: 30 },
    { label: "1 minute", value: 60 },
    { label: "5 minutes", value: 300 },
    { label: "10 minutes", value: 600 },
    { label: "30 minutes", value: 1800 },
  ];

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={autoRefresh ? "default" : "outline"}
        size="sm"
        onClick={() => dispatch(toggleAutoRefresh())}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
        {autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}
      </Button>

      {autoRefresh && (
        <Select
          value={refreshInterval.toString()}
          onValueChange={(value) => dispatch(setRefreshInterval(Number(value)))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {intervals.map(({ label, value }) => (
              <SelectItem key={value} value={value.toString()}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
