"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/store/uiSlice";
import { hydrateInterests, STORAGE_KEY, PROFILE_KEY } from "@/store/interestsSlice";

const THEME_KEY = "3dbharat_theme_v1";

export function ThemeSync() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  // After first mount: read localStorage and sync both theme + interests.
  // This runs only on the client, so no server/client mismatch.
  useEffect(() => {
    try {
      // Theme
      const stored = localStorage.getItem(THEME_KEY);
      const resolved = stored
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      dispatch(setTheme(resolved));

      // Interests + active investor
      const rawIds = localStorage.getItem(STORAGE_KEY);
      const rawProfile = localStorage.getItem(PROFILE_KEY);
      dispatch(
        hydrateInterests({
          dealIds: rawIds ? JSON.parse(rawIds) : [],
          activeInvestorId: rawProfile ? JSON.parse(rawProfile) : null,
        })
      );
    } catch {
      // localStorage blocked (private mode) — defaults stay
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html> class in sync whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return null;
}
