import { useCallback } from "react";

export type SortOrder = "asc" | "desc";

export interface UseSortOptions<T> {
  data: T[];
  sortBy: keyof T;
  sortOrder: SortOrder;
}

export interface UseSortReturn<T> {
  sortedData: T[];
  handleSort: (column: keyof T) => void;
}

/**
 * Custom hook for table sorting logic
 * @template T - The type of data being sorted
 * @param data - Array of data to sort
 * @param sortBy - Current sort column
 * @param sortOrder - Current sort order (asc/desc)
 * @param onSortChange - Callback when sort changes
 * @returns Sorted data and sort handler
 */
export function useTableSort<T extends Record<string, unknown>>(
  data: T[],
  sortBy: keyof T,
  sortOrder: SortOrder,
  onSortChange: (sortBy: keyof T, sortOrder: SortOrder) => void
): UseSortReturn<T> {
  /**
   * Handle column sort
   * Toggles order if same column, defaults to desc for new column
   */
  const handleSort = useCallback(
    (column: keyof T) => {
      const newOrder =
        sortBy === column && sortOrder === "desc" ? "asc" : "desc";
      onSortChange(column, newOrder);
    },
    [sortBy, sortOrder, onSortChange]
  );

  /**
   * Sort the data array
   */
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // String comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Numeric comparison
    const numA = Number(aValue) || 0;
    const numB = Number(bValue) || 0;
    return sortOrder === "asc" ? numA - numB : numB - numA;
  });

  return {
    sortedData,
    handleSort,
  };
}
