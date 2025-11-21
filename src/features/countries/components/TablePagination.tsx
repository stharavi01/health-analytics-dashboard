import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setPage, setPageSize } from "@/features/filters/filtersSlice";

interface TablePaginationProps {
  totalItems: number;
}

const PAGE_SIZES = [10, 25, 50, 100];

/**
 * Table pagination component
 */
export function TablePagination({ totalItems }: TablePaginationProps) {
  const dispatch = useAppDispatch();
  const { page, pageSize } = useAppSelector((state) => state.filters);

  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      dispatch(setPage(page - 1));
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      dispatch(setPage(page + 1));
    }
  };

  const handlePageSizeChange = (value: string) => {
    dispatch(setPageSize(Number(value)));
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={!canGoNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
