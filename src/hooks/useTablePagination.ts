import { useMemo, useCallback } from "react";

export interface UsePaginationOptions {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface UsePaginationReturn<T> {
  paginatedData: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

/**
 * Custom hook for table pagination logic
 * @template T - The type of data being paginated
 * @param data - Array of data to paginate
 * @param currentPage - Current page number (1-indexed)
 * @param itemsPerPage - Number of items per page
 * @param onPageChange - Callback when page changes
 * @returns Paginated data and pagination controls
 */
export function useTablePagination<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number,
  onPageChange: (page: number) => void
): UsePaginationReturn<T> {
  /**
   * Calculate pagination values
   */
  const { paginatedData, totalPages, startIndex, endIndex } = useMemo(() => {
    const total = Math.ceil(data.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = data.slice(start, end);

    return {
      paginatedData: paginated,
      totalPages: total,
      startIndex: start,
      endIndex: Math.min(end, data.length),
    };
  }, [data, currentPage, itemsPerPage]);

  /**
   * Navigation helpers
   */
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      onPageChange(validPage);
    },
    [totalPages, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  }, [hasNextPage, currentPage, onPageChange]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  }, [hasPreviousPage, currentPage, onPageChange]);

  const goToFirstPage = useCallback(() => {
    onPageChange(1);
  }, [onPageChange]);

  const goToLastPage = useCallback(() => {
    onPageChange(totalPages);
  }, [totalPages, onPageChange]);

  return {
    paginatedData,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
  };
}
