"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadDeals } from "@/store/dealsSlice";
import { useDebounce } from "./useDebounce";

const DEFAULT_FILTERS = {
  search: "",
  industries: [],
  riskLevels: [],
  minRoi: undefined,
  maxRoi: undefined,
  minInvestment: undefined,
  maxInvestment: undefined,
  sortBy: "roi",
  sortDir: "desc",
  page: 1,
  pageSize: 12,
};

export function useDeals() {
  const dispatch = useDispatch();
  const { list, listStatus, listError } = useSelector((s) => s.deals);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 350);

  const params = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      debouncedSearch,
      filters.industries,
      filters.riskLevels,
      filters.minRoi,
      filters.maxRoi,
      filters.minInvestment,
      filters.maxInvestment,
      filters.sortBy,
      filters.sortDir,
      filters.page,
      filters.pageSize,
    ]
  );

  useEffect(() => {
    dispatch(loadDeals(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  const updateFilter = useCallback((patch) => {
    setFilters((prev) => ({
      ...prev,
      ...patch,
      page: "page" in patch ? patch.page : 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    deals: list.items,
    total: list.total,
    page: list.page,
    pageSize: list.pageSize,
    status: listStatus,
    error: listError,
    retry: () => dispatch(loadDeals(params)),
  };
}
