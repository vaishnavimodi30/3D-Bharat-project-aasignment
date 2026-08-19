import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDeals, fetchDealById, fetchDealSummary } from "@/services/dealService";

export const loadDeals = createAsyncThunk("deals/loadDeals", async (params) => {
  return await fetchDeals(params);
});

export const loadDealById = createAsyncThunk("deals/loadDealById", async (id) => {
  return await fetchDealById(id);
});

export const loadDealSummary = createAsyncThunk("deals/loadDealSummary", async () => {
  return await fetchDealSummary();
});

const initialState = {
  list: { items: [], total: 0, page: 1, pageSize: 12 },
  listStatus: "idle", // idle | loading | succeeded | failed
  listError: null,

  // Simple cache keyed by JSON.stringify(params) so identical filter/sort
  // combos don't re-hit the "network" while the user is browsing back/forth.
  cache: {},

  current: null,
  currentStatus: "idle",
  currentError: null,

  summary: null,
  summaryStatus: "idle",
  summaryError: null,
};

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    clearCurrentDeal(state) {
      state.current = null;
      state.currentStatus = "idle";
      state.currentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDeals.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(loadDeals.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
        const key = JSON.stringify(action.meta.arg || {});
        state.cache[key] = action.payload;
      })
      .addCase(loadDeals.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.error.message;
      })

      .addCase(loadDealById.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
      })
      .addCase(loadDealById.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(loadDealById.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.error.message;
      })

      .addCase(loadDealSummary.pending, (state) => {
        state.summaryStatus = "loading";
        state.summaryError = null;
      })
      .addCase(loadDealSummary.fulfilled, (state, action) => {
        state.summaryStatus = "succeeded";
        state.summary = action.payload;
      })
      .addCase(loadDealSummary.rejected, (state, action) => {
        state.summaryStatus = "failed";
        state.summaryError = action.error.message;
      });
  },
});

export const { clearCurrentDeal } = dealsSlice.actions;
export default dealsSlice.reducer;
