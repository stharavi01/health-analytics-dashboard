import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Continent, DateRangePreset } from "@/constants/api.constants";

/**
 * Severity levels based on case counts
 */
export type Severity = "All" | "Low" | "Medium" | "High";

/**
 * Filters state interface
 */
export interface FiltersState {
  search: string;
  continent: Continent;
  severity: Severity;
  casesRange: [number, number];
  deathsRange: [number, number];
  activeRange: [number, number];
  recoveryRateRange: [number, number];
  fatalityRateRange: [number, number];
  dateRangePreset: DateRangePreset | "custom";
  customDateRange: { start: Date | null; end: Date | null };
  selectedCountriesForComparison: string[];
  sortBy:
    | "country"
    | "cases"
    | "deaths"
    | "recovered"
    | "active"
    | "todayCases"
    | "todayDeaths";
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

const loadFromLocalStorage = (): Partial<FiltersState> => {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem("filters-preferences");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        itemsPerPage: parsed.itemsPerPage,
        sortBy: parsed.sortBy,
        sortOrder: parsed.sortOrder,
      };
    }
  } catch (error) {
    console.error("Failed to load filters from localStorage:", error);
  }

  return {};
};

const saveToLocalStorage = (state: FiltersState) => {
  if (typeof window === "undefined") return;

  try {
    const preferences = {
      itemsPerPage: state.itemsPerPage,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    };
    localStorage.setItem("filters-preferences", JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save filters to localStorage:", error);
  }
};

const initialState: FiltersState = {
  search: "",
  continent: "All",
  severity: "All",
  casesRange: [0, 100000000],
  deathsRange: [0, 10000000],
  activeRange: [0, 50000000],
  recoveryRateRange: [0, 100],
  fatalityRateRange: [0, 100],
  dateRangePreset: "LAST_30_DAYS",
  customDateRange: { start: null, end: null },
  selectedCountriesForComparison: [],
  sortBy: "cases",
  sortOrder: "desc",
  currentPage: 1,
  itemsPerPage: 10,
  autoRefresh: false,
  refreshInterval: 300,
  ...loadFromLocalStorage(),
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currentPage = 1;
    },

    /**
     * Set continent filter
     */
    setContinent: (state, action: PayloadAction<Continent>) => {
      state.continent = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },

    /**
     * Set severity filter
     */
    setSeverity: (state, action: PayloadAction<Severity>) => {
      state.severity = action.payload;
      state.currentPage = 1;
    },

    setCasesRange: (state, action: PayloadAction<[number, number]>) => {
      state.casesRange = action.payload;
      state.currentPage = 1;
    },

    setDeathsRange: (state, action: PayloadAction<[number, number]>) => {
      state.deathsRange = action.payload;
      state.currentPage = 1;
    },

    setActiveRange: (state, action: PayloadAction<[number, number]>) => {
      state.activeRange = action.payload;
      state.currentPage = 1;
    },

    setRecoveryRateRange: (state, action: PayloadAction<[number, number]>) => {
      state.recoveryRateRange = action.payload;
      state.currentPage = 1;
    },

    setFatalityRateRange: (state, action: PayloadAction<[number, number]>) => {
      state.fatalityRateRange = action.payload;
      state.currentPage = 1;
    },

    setDateRangePreset: (
      state,
      action: PayloadAction<DateRangePreset | "custom">
    ) => {
      state.dateRangePreset = action.payload;
      if (action.payload !== "custom") {
        state.customDateRange = { start: null, end: null };
      }
    },

    setCustomDateRange: (
      state,
      action: PayloadAction<{ start: Date | null; end: Date | null }>
    ) => {
      state.customDateRange = action.payload;
      state.dateRangePreset = "custom";
    },

    addCountryToComparison: (state, action: PayloadAction<string>) => {
      if (!state.selectedCountriesForComparison.includes(action.payload)) {
        state.selectedCountriesForComparison.push(action.payload);
      }
    },

    removeCountryFromComparison: (state, action: PayloadAction<string>) => {
      state.selectedCountriesForComparison =
        state.selectedCountriesForComparison.filter(
          (c) => c !== action.payload
        );
    },

    clearComparison: (state) => {
      state.selectedCountriesForComparison = [];
    },

    toggleAutoRefresh: (state) => {
      state.autoRefresh = !state.autoRefresh;
    },

    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },

    setSort: (
      state,
      action: PayloadAction<{
        sortBy: FiltersState["sortBy"];
        sortOrder: FiltersState["sortOrder"];
      }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      saveToLocalStorage(state);
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
      saveToLocalStorage(state);
    },

    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSearch,
  setContinent,
  setSeverity,
  setCasesRange,
  setDeathsRange,
  setActiveRange,
  setRecoveryRateRange,
  setFatalityRateRange,
  setDateRangePreset,
  setCustomDateRange,
  addCountryToComparison,
  removeCountryFromComparison,
  clearComparison,
  toggleAutoRefresh,
  setRefreshInterval,
  setSort,
  setCurrentPage,
  setItemsPerPage,
  resetFilters,
} = filtersSlice.actions;

/**
 * Selectors
 */
export const selectFilters = (state: { filters: FiltersState }) =>
  state.filters;
export const selectSearch = (state: { filters: FiltersState }) =>
  state.filters.search;
export const selectContinent = (state: { filters: FiltersState }) =>
  state.filters.continent;
export const selectSortBy = (state: { filters: FiltersState }) =>
  state.filters.sortBy;
export const selectSortOrder = (state: { filters: FiltersState }) =>
  state.filters.sortOrder;
export const selectCurrentPage = (state: { filters: FiltersState }) =>
  state.filters.currentPage;
export const selectItemsPerPage = (state: { filters: FiltersState }) =>
  state.filters.itemsPerPage;

/**
 * Reducer export
 */
export default filtersSlice.reducer;
