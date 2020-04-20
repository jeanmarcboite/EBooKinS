import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "ebook",
  initialState: {
    docId: undefined,
    url: undefined,
    location: undefined,
    alice: "https://s3.amazonaws.com/epubjs/books/alice.epub",
    mobydick: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
    toImport: null,
  },
  reducers: {
    loadFile: (state, action) => {
      state.docId = action.payload.docId;
      state.url = action.payload.url;
      state.location = action.payload.location;
    },
    toImport: (state, action) => {
      state.toImport = action.payload;
    },
  },
});

export const { loadFile, toImport } = slice.actions;

export default slice.reducer;
