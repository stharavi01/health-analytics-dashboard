import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { useState } from "react";
import { exportCountriesData, exportGlobalStats } from "@/lib/export-data";
import type { Country, GlobalStats } from "../../countries/types/country.types";
import { toast } from "@/lib/toast";

interface ExportButtonProps {
  data?: {
    countries?: Country[];
    globalStats?: GlobalStats;
  };
}

/**
 * Export Button Component
 * Allows users to export data in CSV or JSON format
 */
export function ExportButton({ data }: ExportButtonProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");

  const handleExport = () => {
    if (!data) {
      toast.error("No data available to export");
      return;
    }

    try {
      if (data.countries) {
        exportCountriesData(data.countries, format);
        toast.success(`Countries data exported as ${format.toUpperCase()}`);
      } else if (data.globalStats) {
        exportGlobalStats(data.globalStats, format);
        toast.success(`Global stats exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Export error:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={format}
        onValueChange={(v) => setFormat(v as "csv" | "json")}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleExport} size="sm" className="gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
}
