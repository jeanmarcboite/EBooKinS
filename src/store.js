import { configureStore } from "@reduxjs/toolkit";
import SettingsReducer from "pages/Settings/store";
import EbookReducer from "pages/Ebook/store";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

let reducer = {
  ebook: persistReducer({ key: "ebook", storage }, EbookReducer),
  settings: persistReducer({ key: "settings", storage }, SettingsReducer),
};

export const store = configureStore({
  reducer,
  middleware: [thunk],
});
export const persistor = persistStore(store);
