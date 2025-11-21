import { configureStore } from "@reduxjs/toolkit";
import { countriesApi } from "@/features/countries/api/countriesApi";
import filtersReducer from "@/features/filters/filtersSlice";

export const store = configureStore({
  reducer: {
    [countriesApi.reducerPath]: countriesApi.reducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(countriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
