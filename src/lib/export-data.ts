import type {
  Country,
  GlobalStats,
} from "@/features/countries/types/country.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: Array<{ key: keyof T; label: string }>
) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const cols =
    columns || Object.keys(data[0]).map((key) => ({ key, label: key }));

  const header = cols.map((col) => col.label).join(",");

  const rows = data.map((row) =>
    cols
      .map((col) => {
        const value = row[col.key];
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      })
      .join(",")
  );

  const csv = [header, ...rows].join("\n");

  downloadFile(csv, `${filename}.csv`, "text/csv");
}

export function exportToJSON<T>(data: T, filename: string) {
  if (!data) {
    console.warn("No data to export");
    return;
  }

  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, "application/json");
}

/**
 * Helper function to trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export countries data with selected columns
 */
export function exportCountriesData(
  countries: Country[],
  format: "csv" | "json" = "csv"
) {
  if (format === "json") {
    exportToJSON(
      countries,
      `covid-countries-${new Date().toISOString().split("T")[0]}`
    );
    return;
  }

  const columns = [
    { key: "country" as const, label: "Country" },
    { key: "continent" as const, label: "Continent" },
    { key: "cases" as const, label: "Total Cases" },
    { key: "todayCases" as const, label: "Today Cases" },
    { key: "deaths" as const, label: "Total Deaths" },
    { key: "todayDeaths" as const, label: "Today Deaths" },
    { key: "recovered" as const, label: "Total Recovered" },
    { key: "todayRecovered" as const, label: "Today Recovered" },
    { key: "active" as const, label: "Active Cases" },
    { key: "critical" as const, label: "Critical" },
    { key: "casesPerOneMillion" as const, label: "Cases Per Million" },
    { key: "deathsPerOneMillion" as const, label: "Deaths Per Million" },
    { key: "tests" as const, label: "Total Tests" },
    { key: "testsPerOneMillion" as const, label: "Tests Per Million" },
    { key: "population" as const, label: "Population" },
  ];

  exportToCSV(
    countries,
    `covid-countries-${new Date().toISOString().split("T")[0]}`,
    columns
  );
}

/**
 * Export global statistics
 */
export function exportGlobalStats(
  stats: GlobalStats,
  format: "csv" | "json" = "csv"
) {
  if (format === "json") {
    exportToJSON(
      stats,
      `covid-global-stats-${new Date().toISOString().split("T")[0]}`
    );
    return;
  }

  // Convert single object to array for CSV export
  const data = [stats];
  const columns = [
    { key: "cases" as const, label: "Total Cases" },
    { key: "todayCases" as const, label: "Today Cases" },
    { key: "deaths" as const, label: "Total Deaths" },
    { key: "todayDeaths" as const, label: "Today Deaths" },
    { key: "recovered" as const, label: "Total Recovered" },
    { key: "todayRecovered" as const, label: "Today Recovered" },
    { key: "active" as const, label: "Active Cases" },
    { key: "critical" as const, label: "Critical" },
    { key: "casesPerOneMillion" as const, label: "Cases Per Million" },
    { key: "deathsPerOneMillion" as const, label: "Deaths Per Million" },
    { key: "tests" as const, label: "Total Tests" },
    { key: "testsPerOneMillion" as const, label: "Tests Per Million" },
    { key: "affectedCountries" as const, label: "Affected Countries" },
  ];

  exportToCSV(
    data,
    `covid-global-stats-${new Date().toISOString().split("T")[0]}`,
    columns
  );
}
