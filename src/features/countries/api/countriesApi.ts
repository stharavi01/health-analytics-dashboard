import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  CACHE_TIME,
} from "@/constants/api.constants";
import type {
  Country,
  GlobalStats,
  HistoricalData,
  GlobalHistoricalData,
} from "../types/country.types";

/**
 * RTK Query API slice using Axios for HTTP requests
 * Provides endpoints for fetching COVID-19 data from disease.sh API
 */
export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: axiosBaseQuery({ baseUrl: API_BASE_URL }),
  keepUnusedDataFor: CACHE_TIME.MEDIUM,

  endpoints: (builder) => ({
    /**
     * Fetch global COVID-19 statistics
     * @returns Global stats including total cases, deaths, recovered, etc.
     */
    getGlobalStats: builder.query<GlobalStats, void>({
      query: () => ({
        url: API_ENDPOINTS.GLOBAL,
        method: "GET",
      }),
    }),

    /**
     * Fetch COVID-19 data for all countries
     * @returns Array of country data with cases, deaths, etc.
     */
    getCountries: builder.query<Country[], void>({
      query: () => ({
        url: API_ENDPOINTS.COUNTRIES,
        method: "GET",
      }),
    }),

    /**
     * Fetch global historical COVID-19 data
     * @param lastdays - Number of days to fetch (default: 30, "all" for all data)
     * @returns Global historical timeline data
     */
    getGlobalHistorical: builder.query<
      GlobalHistoricalData,
      number | "all" | void
    >({
      query: (lastdays = 30) => ({
        url: API_ENDPOINTS.HISTORICAL_ALL,
        method: "GET",
        params: { lastdays },
      }),
    }),

    /**
     * Fetch historical COVID-19 data for a specific country
     * @param country - Country name
     * @param lastdays - Number of days to fetch (default: 30)
     * @returns Country-specific historical timeline data
     */
    getCountryHistorical: builder.query<
      HistoricalData,
      { country: string; lastdays?: number | "all" }
    >({
      query: ({ country, lastdays = 30 }) => ({
        url: API_ENDPOINTS.HISTORICAL_COUNTRY(country),
        method: "GET",
        params: { lastdays },
      }),
    }),
  }),
});

/**
 * Auto-generated hooks for each endpoint
 * Use these hooks in components to fetch data
 */
export const {
  useGetGlobalStatsQuery,
  useGetCountriesQuery,
  useGetGlobalHistoricalQuery,
  useGetCountryHistoricalQuery,
} = countriesApi;
