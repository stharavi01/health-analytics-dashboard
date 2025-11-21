import type { Country } from "@/features/countries/types/country.types";

/**
 * Export data to CSV file
 * @param data - Array of country data to export
 * @param filename - Name of the file to download
 */
export function exportToCSV(
  data: Country[],
  filename: string = "countries-data.csv"
) {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  // Define headers
  const headers = [
    "Country",
    "Continent",
    "Total Cases",
    "Today Cases",
    "Total Deaths",
    "Today Deaths",
    "Recovered",
    "Active",
    "Critical",
    "Tests",
    "Cases Per Million",
    "Deaths Per Million",
    "Tests Per Million",
    "Population",
  ];

  // Convert data to CSV rows
  const rows = data.map((country) => [
    country.country,
    country.continent || "N/A",
    country.cases,
    country.todayCases,
    country.deaths,
    country.todayDeaths,
    country.recovered,
    country.active,
    country.critical,
    country.tests,
    country.casesPerOneMillion,
    country.deathsPerOneMillion,
    country.testsPerOneMillion,
    country.population,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape cells containing commas or quotes
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
