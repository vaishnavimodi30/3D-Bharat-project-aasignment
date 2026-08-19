import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "3dbharat_theme_v1";

// Always start with "light" on both server and client.
// ThemeSync reads localStorage after mount and applies the real preference.
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "light",
  },
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_KEY, state.theme);
      }
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_KEY, state.theme);
      }
    },
  },
});

export const { setTheme, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;

export const THEME_KEY_EXPORT = THEME_KEY;
