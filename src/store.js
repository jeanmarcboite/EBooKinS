import { configureStore } from "@reduxjs/toolkit";
import SettingsReducer from "pages/Settings/store";
import EbookReducer from "pages/Ebook/store";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import logger from "redux-logger";
let reducer = {
  ebook: persistReducer({ key: "ebook", storage }, EbookReducer),
  settings: persistReducer({ key: "settings", storage }, SettingsReducer),
};

const middleware = [thunk];
if (false) middleware.push(logger);

export const store = configureStore({
  reducer,
  middleware,
});
export const persistor = persistStore(store);
