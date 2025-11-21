import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setRecoveryRateRange,
  setFatalityRateRange,
  selectFilters,
} from "../filtersSlice";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { HeartPulse, AlertTriangle } from "lucide-react";

/**
 * Advanced Filters Component
 * Provides recovery rate and fatality rate range filters
 */
export function AdvancedFilters() {
  const dispatch = useAppDispatch();
  const { recoveryRateRange, fatalityRateRange } =
    useAppSelector(selectFilters);

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold text-sm">Advanced Filters</h3>

      {/* Recovery Rate Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-green-500" />
            <label className="text-sm font-medium">Recovery Rate (%)</label>
          </div>
          <span className="text-xs text-muted-foreground">
            {recoveryRateRange[0]}% - {recoveryRateRange[1]}%
          </span>
        </div>
        <Slider
          value={recoveryRateRange}
          onValueChange={(value) =>
            dispatch(setRecoveryRateRange(value as [number, number]))
          }
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Fatality Rate Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <label className="text-sm font-medium">Fatality Rate (%)</label>
          </div>
          <span className="text-xs text-muted-foreground">
            {fatalityRateRange[0]}% - {fatalityRateRange[1]}%
          </span>
        </div>
        <Slider
          value={fatalityRateRange}
          onValueChange={(value) =>
            dispatch(setFatalityRateRange(value as [number, number]))
          }
          min={0}
          max={100}
          step={0.1}
          className="w-full"
        />
      </div>
    </Card>
  );
}
