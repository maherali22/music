import express from "express";
import tryCatch from "../utils/tryCatch.js";
import { userAuthentication } from "../middlewares/authMiddleware.js";
import {
  userRegistration,
  getCurrentUser,
  verifyOtp,
  userLogin,
  userLogout,
  editUserProfile,
} from "../controller/user.auth.Controller.js";
import upload from "../middlewares/upload.js";
import {
  getAllSongs,
  getSongById,
} from "../controller/user.Song.Controller.js";

import {
  createPlaylist,
  getAllPlaylist,
  getPlaylistById,
  deleteSongFromPlaylist,
  deletePlaylist,
} from "../controller/user.Playlist.controller.js";
import {
  addToLikedSongs,
  getLikedSongs,
  removeFromLikedSongs,
  getAlbum,
  getArtist,
} from "../controller/user.LikedSongs.Controller.js";

const Router = express.Router();

//auth routes of users
Router.post("/register", tryCatch(userRegistration))
  .put("/verify", tryCatch(verifyOtp))
  .post("/login", tryCatch(userLogin))
  .delete("/logout", userAuthentication, tryCatch(userLogout))
  .get("/current-user", userAuthentication, tryCatch(getCurrentUser))
  .put("/edit-profile", userAuthentication, upload, tryCatch(editUserProfile));

//user song control

Router.get("/songs", userAuthentication, tryCatch(getAllSongs)).get(
  "/songs/:id",
  userAuthentication,
  tryCatch(getSongById)
);

//user playlist control
Router.post("/create-playlist", userAuthentication, tryCatch(createPlaylist))
  .get("/get-all-playlist", userAuthentication, tryCatch(getAllPlaylist))
  .get("/get-playlist/:id", userAuthentication, tryCatch(getPlaylistById))
  .delete(
    "/delete-song-from-playlist",
    userAuthentication,
    tryCatch(deleteSongFromPlaylist)
  )
  .delete("/delete-playlist/:id", userAuthentication, tryCatch(deletePlaylist));

// user liked songs control
Router.post("/add-to-liked-songs/:id", tryCatch(addToLikedSongs))
  .get("/get-liked-songs", userAuthentication, tryCatch(getLikedSongs))
  .delete(
    "/remove-from-liked-songs",
    userAuthentication,
    tryCatch(removeFromLikedSongs)
  )
  .get("/get-album", userAuthentication, tryCatch(getAlbum))
  .get("/get-artist", userAuthentication, tryCatch(getArtist));

export default Router;
