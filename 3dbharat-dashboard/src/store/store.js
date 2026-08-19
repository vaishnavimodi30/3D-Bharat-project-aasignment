import { configureStore } from "@reduxjs/toolkit";
import dealsReducer from "./dealsSlice";
import corporateReducer from "./corporateSlice";
import interestsReducer from "./interestsSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    deals: dealsReducer,
    corporate: corporateReducer,
    interests: interestsReducer,
    ui: uiReducer,
  },
});
