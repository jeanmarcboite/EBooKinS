import { createSlice } from "@reduxjs/toolkit";
import { storeEpub } from "lib/Epub";

export const slice = createSlice({
  name: "ebook",
  initialState: {
    filename: undefined,
    url: "https://s3.amazonaws.com/epubjs/books/alice.epub",
    data: "https://s3.amazonaws.com/epubjs/books/alice.epub",
    mobydick: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
    location: undefined,
    toImport: null,
  },
  reducers: {
    loadFile: (state, action) => {
      state.url = action.payload;
      state.location = undefined;
      localStorage.removeItem("cfi");
    },
    importFile: (state, action) => {
      state.toImport = action.payload;
    },
    setLocation: (state, action) => {
      if (state.location !== action.payload) state.location = action.payload;
    },
  },
});

export const { loadFile, importFile, setLocation } = slice.actions;

export const selectEbook = (state) => state.ebook;

export default slice.reducer;
