import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import axiosInstance from "./axios";

/**
 * Arguments for Axios base query
 */
interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}

/**
 * Custom error type with user-friendly message
 */
interface CustomAxiosError extends AxiosError {
  userMessage?: string;
}

/**
 * Axios-based baseQuery for RTK Query
 * Combines Axios error handling with RTK Query caching
 *
 * @param baseUrl - Base URL to prepend to all requests (optional)
 * @returns RTK Query base query function
 *
 * @example
 * ```typescript
 * export const api = createApi({
 *   baseQuery: axiosBaseQuery({ baseUrl: '/api' }),
 *   endpoints: (builder) => ({
 *     getData: builder.query({
 *       query: () => ({ url: '/data', method: 'GET' }),
 *     }),
 *   }),
 * });
 * ```
 */
export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as CustomAxiosError;
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || err.message,
          userMessage: err.userMessage || "An error occurred",
        },
      };
    }
  };
