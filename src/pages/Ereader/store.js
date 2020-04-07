import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "ereader",
  initialState: {
    filename: undefined,
    data: "https://s3.amazonaws.com/epubjs/books/alice.epub",
    mobydick: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
  },
  reducers: {
    loadFile: (state, action) => {
      state.filename = action.payload.name;
      state.data = action.payload.data;
    },
  },
});

export const { loadFile } = slice.actions;

export const selectFile = (state) => state.ereader.data;
export const selectEreader = (state) => state.ereader;

export default slice.reducer;
