import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCorporateAnalytics } from "@/services/investorService";

export const loadCorporateAnalytics = createAsyncThunk(
  "corporate/loadAnalytics",
  async () => await fetchCorporateAnalytics()
);

const corporateSlice = createSlice({
  name: "corporate",
  initialState: {
    analytics: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCorporateAnalytics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCorporateAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.analytics = action.payload;
      })
      .addCase(loadCorporateAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default corporateSlice.reducer;
