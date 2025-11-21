import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  CACHE_TIME,
} from "@/constants/api.constants";
import type { Country, GlobalStats } from "../types/country.types";

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
  }),
});

/**
 * Auto-generated hooks for each endpoint
 * Use these hooks in components to fetch data
 */
export const { useGetGlobalStatsQuery, useGetCountriesQuery } = countriesApi;
