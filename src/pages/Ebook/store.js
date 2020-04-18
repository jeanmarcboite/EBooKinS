import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "ebook",
  initialState: {
    filename: undefined,
    url: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
    data: "https://s3.amazonaws.com/epubjs/books/alice.epub",
    mobydick: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
    location: undefined,
  },
  reducers: {
    loadFile: (state, action) => {
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

export const selectEbook = (state) => state.ebook;

export default slice.reducer;
