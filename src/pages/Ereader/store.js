import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "ereader",
  initialState: {
    filename: undefined,
    url: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
    data: "https://s3.amazonaws.com/epubjs/books/alice.epub",
    mobydick: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
    location: undefined,
  },
  reducers: {
    loadFile: (state, action) => {
      console.log("load file ", action.payload);
      state.url = action.payload;
      state.location = undefined;
      localStorage.removeItem("cfi");
    },
    setLocation: (state, action) => {
      if (state.location !== action.payload) state.location = action.payload;
    },
  },
});

export const { loadFile, setLocation } = slice.actions;

export const selectFile = (state) => state.ereader.data;
export const selectEreader = (state) => state.ereader;

export default slice.reducer;
