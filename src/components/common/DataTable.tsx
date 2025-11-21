import { memo, ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  sticky?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
  onSort?: (column: keyof T) => void;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  stickyHeader?: boolean;
  className?: string;
  emptyMessage?: string;
}

/**
 * Generic reusable data table component with sorting and sticky columns
 * @template T - The type of data being displayed
 */
function DataTableComponent<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  actions,
  stickyHeader = true,
  className,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  /**
   * Get appropriate sort icon based on current state
   */
  const getSortIcon = (columnKey: keyof T): LucideIcon => {
    if (sortBy !== columnKey) return ArrowUpDown;
    return sortOrder === "desc" ? ArrowDown : ArrowUp;
  };

  /**
   * Render sort icon for column headers
   */
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable || !onSort) return null;

    const SortIconComponent = getSortIcon(column.key);

    return (
      <SortIconComponent
        className={cn(
          "h-3 w-3 ml-1 transition-opacity",
          sortBy === column.key ? "opacity-100" : "opacity-50"
        )}
      />
    );
  };
  /**
   * Handle column header click
   */
  const handleHeaderClick = (column: Column<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead className={cn("bg-muted", stickyHeader && "sticky top-0 z-10")}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-3 text-sm font-medium",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.align !== "center" &&
                    column.align !== "right" &&
                    "text-left",
                  column.sortable &&
                    onSort &&
                    "cursor-pointer hover:bg-muted/80",
                  column.sticky && "sticky left-0 bg-muted z-20",
                  column.className
                )}
                onClick={() => handleHeaderClick(column)}
              >
                <div
                  className={cn(
                    "flex items-center gap-1",
                    column.align === "center" && "justify-center",
                    column.align === "right" && "justify-end"
                  )}
                >
                  {column.label}
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-center text-sm font-medium w-20">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row) => (
            <TableRow
              key={keyExtractor(row)}
              row={row}
              columns={columns}
              onClick={onRowClick}
              actions={actions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Memoized table row component for performance
 */
interface TableRowProps<T> {
  row: T;
  columns: Column<T>[];
  onClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
}

const TableRow = memo(function TableRow<T extends Record<string, unknown>>({
  row,
  columns,
  onClick,
  actions,
}: TableRowProps<T>) {
  return (
    <tr
      className={cn(
        "hover:bg-muted/50 transition-colors group",
        onClick && "cursor-pointer"
      )}
      onClick={() => onClick?.(row)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(row);
        }
      }}
    >
      {columns.map((column) => (
        <td
          key={String(column.key)}
          className={cn(
            "px-4 py-3",
            column.align === "center" && "text-center",
            column.align === "right" && "text-right",
            column.sticky &&
              "sticky left-0 bg-card group-hover:bg-muted/50 transition-colors z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]",
            column.className
          )}
        >
          {column.render
            ? column.render(row[column.key], row)
            : String(row[column.key] ?? "")}
        </td>
      ))}
      {actions && (
        <td className="px-4 py-3 text-center">
          <div className="flex items-center justify-center">{actions(row)}</div>
        </td>
      )}
    </tr>
  );
}) as <T extends Record<string, unknown>>(
  props: TableRowProps<T>
) => React.ReactElement;

/**
 * Export memoized component
 */
export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;
