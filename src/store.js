import { configureStore } from "@reduxjs/toolkit";
import SettingsReducer from "pages/Settings/store";
import EbookReducer from "pages/Ebook/store";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "bookins",
  storage,
};

let reducer = {
  ebook: EbookReducer,
  settings: persistReducer(persistConfig, SettingsReducer),
};

export const store = configureStore({
  reducer,
  middleware: [thunk],
});
export const persistor = persistStore(store);
