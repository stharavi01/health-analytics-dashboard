import { describe, it, expect } from "vitest";
import filtersReducer, {
  setSearch,
  setContinent,
  toggleSortDirection,
  setPage,
  setPageSize,
  resetFilters,
} from "./filtersSlice";
import type { FilterState } from "../countries/types/country.types";

describe("filtersSlice", () => {
  const initialState: FilterState = {
    search: "",
    continent: "All",
    sortField: "cases",
    sortDirection: "desc",
    page: 1,
    pageSize: 25,
  };

  it("should return initial state", () => {
    expect(filtersReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  it("should handle setSearch", () => {
    const actual = filtersReducer(initialState, setSearch("United"));
    expect(actual.search).toBe("United");
    expect(actual.page).toBe(1);
  });

  it("should handle setContinent", () => {
    const actual = filtersReducer(initialState, setContinent("Asia"));
    expect(actual.continent).toBe("Asia");
    expect(actual.page).toBe(1);
  });

  it("should toggle sort direction for same field", () => {
    const actual = filtersReducer(initialState, toggleSortDirection("cases"));
    expect(actual.sortDirection).toBe("asc");

    const toggled = filtersReducer(actual, toggleSortDirection("cases"));
    expect(toggled.sortDirection).toBe("desc");
  });

  it("should set new sort field with desc direction", () => {
    const actual = filtersReducer(initialState, toggleSortDirection("deaths"));
    expect(actual.sortField).toBe("deaths");
    expect(actual.sortDirection).toBe("desc");
  });

  it("should handle setPage", () => {
    const actual = filtersReducer(initialState, setPage(3));
    expect(actual.page).toBe(3);
  });

  it("should handle setPageSize and reset page", () => {
    const state = { ...initialState, page: 5 };
    const actual = filtersReducer(state, setPageSize(50));
    expect(actual.pageSize).toBe(50);
    expect(actual.page).toBe(1);
  });

  it("should reset all filters", () => {
    const modifiedState: FilterState = {
      search: "India",
      continent: "Asia",
      sortField: "deaths",
      sortDirection: "asc",
      page: 3,
      pageSize: 50,
    };
    const actual = filtersReducer(modifiedState, resetFilters());
    expect(actual).toEqual(initialState);
  });
});
