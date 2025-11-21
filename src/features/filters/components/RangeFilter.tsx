import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

/**
 * Range slider filter component with live preview
 */
export function RangeFilter({
  label,
  min,
  max,
  value,
  onChange,
  formatValue = (v) => v.toLocaleString(),
}: RangeFilterProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: number[]) => {
    const rangeValue: [number, number] = [newValue[0], newValue[1]];
    setLocalValue(rangeValue);
  };

  const handleCommit = (newValue: number[]) => {
    const rangeValue: [number, number] = [newValue[0], newValue[1]];
    onChange(rangeValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">
          {formatValue(localValue[0])} - {formatValue(localValue[1])}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={Math.max(1, Math.floor((max - min) / 1000))}
        value={localValue}
        onValueChange={handleChange}
        onValueCommit={handleCommit}
        className="w-full"
      />
    </div>
  );
}
