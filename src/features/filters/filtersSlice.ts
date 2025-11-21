import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  FilterState,
  SortField,
  SortDirection,
} from "../countries/types/country.types";

const initialState: FilterState = {
  search: "",
  continent: "All",
  sortField: "cases",
  sortDirection: "desc",
  page: 1,
  pageSize: 25,
};

/**
 * Redux slice for managing table filters and pagination
 */
const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // Reset to first page on search
    },

    setContinent: (state, action: PayloadAction<string>) => {
      state.continent = action.payload;
      state.page = 1; // Reset to first page on filter
    },

    setSort: (
      state,
      action: PayloadAction<{ field: SortField; direction: SortDirection }>
    ) => {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
    },

    toggleSortDirection: (state, action: PayloadAction<SortField>) => {
      if (state.sortField === action.payload) {
        // Toggle direction if same field
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        // New field - default to descending
        state.sortField = action.payload;
        state.sortDirection = "desc";
      }
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1; // Reset to first page on page size change
    },

    resetFilters: () => initialState,
  },
});

export const {
  setSearch,
  setContinent,
  setSort,
  toggleSortDirection,
  setPage,
  setPageSize,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
