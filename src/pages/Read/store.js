import { createSlice } from "@reduxjs/toolkit";

import DB from "lib/Database";

const links = {
  alice: "https://s3.amazonaws.com/epubjs/books/alice.epub",
  mobydick: "https://s3.amazonaws.com/moby-dick/moby-dick.epub",
};

export const slice = createSlice({
  name: "ebook",
  initialState: {
    url: links.alice,
  },
  reducers: {
    loadFile: (state, action) => {
      state.url = action.payload;
    },
    importFile: (state, action) => {
      DB.ebooks
        .putEpub(action.payload)
        .then(() => console.log("import OK"))
        .catch((err) => console.error(err));
      // state is not modified
      //state.toImport = action.payload;
    },
  },
});

export const { loadFile, importFile, updateDB } = slice.actions;

export default slice.reducer;
/*
export default enableBatching(slice.reducer);

export const importThenLoadFile = (action) => (dispatch) => {
  DB.ebooks.put(action.payload).then(dispatch(loadFile(action)));
};
*/
