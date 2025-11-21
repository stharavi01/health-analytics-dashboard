import { configureStore } from "@reduxjs/toolkit";
import { countriesApi } from "@/features/countries/api/countriesApi";
import filtersReducer from "@/features/filters/filtersSlice";

/**
 * Redux store configuration
 * Combines RTK Query API and filters slice
 */
export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [countriesApi.reducerPath]: countriesApi.reducer,

    // Filters state
    filters: filtersReducer,
  },

  // Add RTK Query middleware for caching and refetching
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(countriesApi.middleware),
});

// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
