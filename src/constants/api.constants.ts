/**
 * API Configuration and Constants
 */

export const API_BASE_URL = "https://disease.sh/v3/covid-19";

export const API_ENDPOINTS = {
  GLOBAL: "/all",
  COUNTRIES: "/countries",
  HISTORICAL: "/historical",
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
