import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Compound Component Pattern for Table
 * Demonstrates advanced React composition and component architecture
 *
 * Example usage:
 * <Table>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Name</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>Data</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 */

interface TableProps {
  children: ReactNode;
  className?: string;
}

function Root({ children, className }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)}>
        {children}
      </table>
    </div>
  );
}

function TableHeader({ children, className }: TableProps) {
  return (
    <thead className={cn("bg-muted sticky top-0 z-10", className)}>
      {children}
    </thead>
  );
}

function TableBody({ children, className }: TableProps) {
  return <tbody className={cn("divide-y", className)}>{children}</tbody>;
}

interface TableRowProps extends TableProps {
  onClick?: () => void;
  isClickable?: boolean;
}

function TableRow({
  children,
  className,
  onClick,
  isClickable,
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        isClickable && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps extends TableProps {
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: "asc" | "desc" | null;
}

function TableHead({
  children,
  className,
  sortable,
  onSort,
  sortDirection,
}: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
        sortable && "cursor-pointer hover:bg-muted/80",
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && sortDirection && (
          <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
        )}
      </div>
    </th>
  );
}

interface TableCellProps extends TableProps {
  align?: "left" | "center" | "right";
}

function TableCell({ children, className, align = "left" }: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td className={cn("p-4 align-middle", alignClass[align], className)}>
      {children}
    </td>
  );
}

export const Table = Object.assign(Root, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
});
