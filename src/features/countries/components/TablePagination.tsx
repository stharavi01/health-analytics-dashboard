import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

/**
 * Pagination component for table navigation
 */
export function TablePagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-3 py-2 sm:px-4 sm:py-3 bg-card">
      {/* Compact layout for mobile: items per page + page info in one row */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
            Rows per page:
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground sm:hidden">
            Rows:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 border border-input rounded-md bg-background text-xs sm:text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Page info */}
        <div className="text-xs sm:text-sm text-muted-foreground">
          {startItem}-{endItem} of {totalItems}
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          aria-label="First page"
        >
          <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        <div className="flex items-center gap-1 mx-1 sm:mx-2">
          <span className="text-xs sm:text-sm whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          aria-label="Next page"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          aria-label="Last page"
        >
          <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}
