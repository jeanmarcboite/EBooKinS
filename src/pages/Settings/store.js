import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "settings",
  initialState: {
    darkMode: false,
    menuTrigger: "right",
    leftPanelSize: 250,
  },
  reducers: {
    setSetting: (state, action) => {
      state[action.payload.setting] = action.payload.value;
    },
  },
});

export const { setSetting } = slice.actions;

export default slice.reducer;
