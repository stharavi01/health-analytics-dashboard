import axios from "axios";
import { apiErrorHandler } from "./error-handler";

/**
 * Base API URL from environment variables
 * Defaults to disease.sh API if not specified
 */
const API_URL =
  import.meta.env.VITE_API_URL || "https://disease.sh/v3/covid-19";

/**
 * Configured Axios instance with interceptors
 * Handles authentication, error logging, and user-friendly error messages
 */
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Response interceptor for centralized error handling
 * Transforms API errors into user-friendly messages
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging with user-friendly messages
    if (error.response?.data) {
      const userMessage = apiErrorHandler.getErrorMessage(error.response.data);
      error.userMessage = userMessage;

      if (import.meta.env.DEV) {
        console.error("API Error:", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response.status,
          data: error.response.data,
          userMessage,
        });
      }
    } else if (error.request) {
      // Network error
      error.userMessage =
        "Network error. Please check your internet connection.";
      console.error("Network Error:", error.message);
    } else {
      // Unknown error
      error.userMessage = "An unexpected error occurred";
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
