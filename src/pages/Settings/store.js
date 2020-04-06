import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "settings",
  initialState: {
    darkMode: false,
  },
  reducers: {
    setSetting: (state, action) => {
      state[action.payload.setting] = action.payload.value;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload === undefined ? true : action.payload;
    },
  },
});

export const { setSetting, setDarkMode } = slice.actions;

export const darkMode = (state) => state.settings.darkMode;

export default slice.reducer;
