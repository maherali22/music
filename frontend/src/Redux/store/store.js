import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default localStorage for web
import { combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Import slices
import userSlice from "../slice/user.Slice/authSlice.js";
import songSlice from "../slice/user.Slice/songSlice.js";
import albumSlice from "../slice/user.Slice/albumSlice.js";
import artistSlice from "../slice/user.Slice/artistSlice.js";
import playlistSlice from "../slice/user.Slice/playlistSlice.js";
import likedSongSlice from "../slice/user.Slice/likedSlice.js";
import userPlaylistSlice from "../slice/user.Slice/userPlaylistSlice.js";
import adminAuthSlice from "../slice/admin.Slice/adminAuthSlice.js";
import adminUserSlice from "../slice/admin.Slice/adminUserSlice.js";
import adminSongSlice from "../slice/admin.Slice/adminSong.js";

// Persist configuration
const persistConfig = {
  key: "root", // Root key for the persisted state
  storage, // Use localStorage
  whitelist: ["user", "playlist", "admin", "userPlaylist"],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userSlice,
  song: songSlice,
  albums: albumSlice,
  artist: artistSlice,
  playlist: playlistSlice,
  likedSong: likedSongSlice,
  userPlaylist: userPlaylistSlice,
  admin: adminAuthSlice,
  allUsers: adminUserSlice,
  adminSong: adminSongSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export persistor for use with PersistGate
export const persistor = persistStore(store);
