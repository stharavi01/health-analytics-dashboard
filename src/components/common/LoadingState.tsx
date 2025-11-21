import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  type?: "table" | "cards" | "stats" | "custom";
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Reusable loading state component with skeleton patterns
 */
export function LoadingState({
  type = "custom",
  rows = 5,
  columns = 4,
  className,
}: LoadingStateProps) {
  if (type === "table") {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Table header skeleton */}
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1" />
          ))}
        </div>
        {/* Table rows skeleton */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-12 flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
          className
        )}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Stats header */}
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Custom skeleton
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

/**
 * Loading state for full page
 */
export function PageLoadingState() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-80 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <LoadingState type="cards" />
      <Card className="p-6">
        <LoadingState type="table" rows={8} columns={6} />
      </Card>
    </div>
  );
}
