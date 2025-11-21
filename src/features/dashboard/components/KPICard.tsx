import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

interface KPICardProps {
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color: "blue" | "red" | "green" | "orange";
  trend?: "up" | "down";
}

const colorClasses = {
  blue: "text-blue-600 dark:text-blue-400",
  red: "text-red-600 dark:text-red-400",
  green: "text-green-600 dark:text-green-400",
  orange: "text-orange-600 dark:text-orange-400",
};

const iconBgClasses = {
  blue: "bg-blue-100 dark:bg-blue-900/20",
  red: "bg-red-100 dark:bg-red-900/20",
  green: "bg-green-100 dark:bg-green-900/20",
  orange: "bg-orange-100 dark:bg-orange-900/20",
};

/**
 * Enhanced KPI Card with animations, copy-to-clipboard, and trend indicators
 */
export function KPICard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  trend,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [copied, setCopied] = useState(false);

  // Animated counter effect
  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.toLocaleString());
      setCopied(true);
      toast.success("Value copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Card
      className="p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
      onClick={handleCopy}
    >
      {/* Background icon decoration */}
      <div
        className={cn(
          "absolute -right-4 -top-4 opacity-5",
          iconBgClasses[color]
        )}
      >
        <Icon className="h-32 w-32" />
      </div>

      {/* Content */}
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={cn("p-2 rounded-lg", iconBgClasses[color])}>
            <Icon className={cn("h-5 w-5", colorClasses[color])} />
          </div>
        </div>

        <div className="space-y-1">
          <p
            className={cn(
              "text-3xl font-bold tabular-nums",
              colorClasses[color]
            )}
          >
            {displayValue.toLocaleString()}
          </p>

          {change !== undefined && (
            <div className="flex items-center gap-1">
              {trend === "up" && (
                <TrendingUp className="h-4 w-4 text-green-600" />
              )}
              {trend === "down" && (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className="text-xs text-muted-foreground">
                {change > 0 && "+"}
                {change.toLocaleString()} {changeLabel || "today"}
              </span>
            </div>
          )}
        </div>

        {/* Copy indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </Card>
  );
}
