import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  CACHE_TIME,
} from "@/constants/api.constants";
import type { Country, GlobalStats } from "../types/country.types";

/**
 * RTK Query API slice for COVID-19 data
 * Handles all API calls with automatic caching and refetching
 */
export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),

  // Cache data for 5 minutes by default
  keepUnusedDataFor: CACHE_TIME.MEDIUM,

  endpoints: (builder) => ({
    // Fetch global COVID-19 statistics
    getGlobalStats: builder.query<GlobalStats, void>({
      query: () => API_ENDPOINTS.GLOBAL,
    }),

    // Fetch all countries data
    getCountries: builder.query<Country[], void>({
      query: () => API_ENDPOINTS.COUNTRIES,
    }),
  }),
});

// Export hooks for usage in components
export const { useGetGlobalStatsQuery, useGetCountriesQuery } = countriesApi;
