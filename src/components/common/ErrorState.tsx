import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "warning";
}

/**
 * Reusable error state component with retry functionality
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
  variant = "destructive",
}: ErrorStateProps) {
  const variantStyles = {
    default: "border-muted bg-muted/10",
    destructive: "border-destructive bg-destructive/10",
    warning: "border-yellow-500 bg-yellow-500/10",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    destructive: "text-destructive",
    warning: "text-yellow-600",
  };

  const titleStyles = {
    default: "text-foreground",
    destructive: "text-destructive",
    warning: "text-yellow-700 dark:text-yellow-500",
  };

  return (
    <div
      className={cn("rounded-lg border p-6", variantStyles[variant], className)}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className={cn("h-5 w-5 mt-0.5 shrink-0", iconStyles[variant])}
          aria-hidden="true"
        />
        <div className="flex-1 space-y-2">
          <h3 className={cn("font-semibold", titleStyles[variant])}>{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
