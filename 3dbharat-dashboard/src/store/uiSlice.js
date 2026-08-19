import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "3dbharat_theme_v1";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: getInitialTheme(),
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_KEY, state.theme);
      }
    },
  },
});

export const { toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
