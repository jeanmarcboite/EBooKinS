import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "ebook",
  initialState: {
    docId: "https://s3.amazonaws.com/epubjs/books/alice.epub",
    url: "https://s3.amazonaws.com/epubjs/books/alice.epub",
    location: undefined,
    mobydick: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
    toImport: null,
  },
  reducers: {
    loadFile: (state, action) => {
      state.docId = action.payload.docId;
      state.url = action.payload.url
    },
    toImport: (state, action) => {
      state.toImport = action.payload;
    },
  },
});

export const { loadFile, toImport } = slice.actions;

export default slice.reducer;
