import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "3dbharat_interests_v1";
const PROFILE_KEY = "3dbharat_active_investor_v1";

function loadFromStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently,
    // interests just won't persist across reloads.
  }
}

const initialState = {
  dealIds: loadFromStorage(STORAGE_KEY, []),
  activeInvestorId: loadFromStorage(PROFILE_KEY, null),
};

const interestsSlice = createSlice({
  name: "interests",
  initialState,
  reducers: {
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

export const { toggleInterest, setActiveInvestor } = interestsSlice.actions;
export default interestsSlice.reducer;
