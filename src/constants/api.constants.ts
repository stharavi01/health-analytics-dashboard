/**
 * API Configuration and Constants
 */

export const API_BASE_URL = "https://disease.sh/v3/covid-19";

export const API_ENDPOINTS = {
  GLOBAL: "/all",
  COUNTRIES: "/countries",
  HISTORICAL: "/historical",
  HISTORICAL_ALL: "/historical/all",
  HISTORICAL_COUNTRY: (country: string) => `/historical/${country}`,
} as const;

export const CACHE_TIME = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
} as const;

export const CONTINENTS = [
  "All",
  "Asia",
  "Europe",
  "Africa",
  "North America",
  "South America",
  "Oceania",
] as const;

export type Continent = (typeof CONTINENTS)[number];

/**
 * Date range presets for filtering historical data
 */
export const DATE_RANGE_PRESETS = {
  LAST_7_DAYS: { label: "Last 7 Days", days: 7 },
  LAST_30_DAYS: { label: "Last 30 Days", days: 30 },
  LAST_90_DAYS: { label: "Last 90 Days", days: 90 },
  LAST_6_MONTHS: { label: "Last 6 Months", days: 180 },
  LAST_YEAR: { label: "Last Year", days: 365 },
  ALL_TIME: { label: "All Time", days: "all" },
} as const;

export type DateRangePreset = keyof typeof DATE_RANGE_PRESETS;
