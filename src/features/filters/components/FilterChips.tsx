import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterChip {
  id: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onClearAll: () => void;
}

/**
 * Display active filters as removable chips
 */
export function FilterChips({ filters, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
        >
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <button
            onClick={filter.onRemove}
            className="ml-1 rounded-full p-0.5 hover:bg-muted"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-muted-foreground hover:text-foreground underline"
      >
        Clear all
      </button>
    </div>
  );
}
