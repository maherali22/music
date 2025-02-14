import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userSlice from "../slice/user.Slice/authSlice.js";
import songSlice from "../slice/user.Slice/songSlice.js";
import albumSlice from "../slice/user.Slice/albumSlice.js";
import artistSlice from "../slice/user.Slice/artistSlice.js";
import playlistSlice from "../slice/user.Slice/playlistSlice.js";

 

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "admin"],
};

const rootReducer = combineReducers({
  auth: userSlice,
  song: songSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
