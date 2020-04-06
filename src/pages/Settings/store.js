import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "settings",
  initialState: {
    darkMode: false,
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload === undefined ? true : action.payload;
    },
  },
});

export const { setDarkMode } = slice.actions;

export const darkMode = (state) => state.settings.darkMode;

export default slice.reducer;
