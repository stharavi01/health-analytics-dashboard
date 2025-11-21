import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  format?: "number" | "percentage";
}

/**
 * KPI Card component for displaying key metrics
 */
export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  format = "number",
}: KPICardProps) {
  const formattedValue =
    typeof value === "number" && format === "number"
      ? formatNumber(value)
      : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span
              className={trend.isPositive ? "text-green-600" : "text-red-600"}
            >
              {trend.isPositive ? "+" : ""}
              {formatNumber(trend.value)}
            </span>{" "}
            from yesterday
          </p>
        )}
      </CardContent>
    </Card>
  );
}
