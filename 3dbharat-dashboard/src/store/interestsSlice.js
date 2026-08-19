import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "3dbharat_interests_v1";
const PROFILE_KEY = "3dbharat_active_investor_v1";

function saveToStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota / private mode — fail silently */ }
}

// Always start empty on both server and client.
// Providers.jsx hydrates from localStorage after mount.
const initialState = {
  dealIds: [],
  activeInvestorId: null,
  _hydrated: false,
};

const interestsSlice = createSlice({
  name: "interests",
  initialState,
  reducers: {
    hydrateInterests(state, action) {
      state.dealIds = action.payload.dealIds;
      state.activeInvestorId = action.payload.activeInvestorId;
      state._hydrated = true;
    },
    toggleInterest(state, action) {
      const id = action.payload;
      const idx = state.dealIds.indexOf(id);
      if (idx >= 0) state.dealIds.splice(idx, 1);
      else state.dealIds.push(id);
      saveToStorage(STORAGE_KEY, state.dealIds);
    },
    setActiveInvestor(state, action) {
      state.activeInvestorId = action.payload;
      saveToStorage(PROFILE_KEY, state.activeInvestorId);
    },
  },
});

export const { hydrateInterests, toggleInterest, setActiveInvestor } = interestsSlice.actions;
export { STORAGE_KEY, PROFILE_KEY };
export default interestsSlice.reducer;
