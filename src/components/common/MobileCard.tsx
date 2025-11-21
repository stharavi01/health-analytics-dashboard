import { memo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MobileCardProps<T> {
  data: T;
  renderContent: (data: T) => React.ReactNode;
  onClick?: (data: T) => void;
  className?: string;
}

/**
 * Mobile-friendly card component for displaying table data on small screens
 */
function MobileCardComponent<T>({
  data,
  renderContent,
  onClick,
  className,
}: MobileCardProps<T>) {
  return (
    <Card
      className={cn(
        "p-4 hover:shadow-md transition-all",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
      onClick={() => onClick?.(data)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(data);
        }
      }}
    >
      {renderContent(data)}
    </Card>
  );
}

export const MobileCard = memo(
  MobileCardComponent
) as typeof MobileCardComponent;

export interface MobileCardListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string | number;
  renderCard: (item: T) => React.ReactNode;
  onClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * List of mobile cards with responsive layout
 */
function MobileCardListComponent<T>({
  data,
  keyExtractor,
  renderCard,
  onClick,
  emptyMessage = "No items to display",
  className,
}: MobileCardListProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item) => (
        <MobileCard
          key={keyExtractor(item)}
          data={item}
          renderContent={renderCard}
          onClick={onClick}
        />
      ))}
    </div>
  );
}

export const MobileCardList = memo(
  MobileCardListComponent
) as typeof MobileCardListComponent;
