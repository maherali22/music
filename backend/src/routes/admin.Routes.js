import express from "express";
import tryCatch from "../utils/tryCatch.js";
import {
  adminLogin,
  adminLogout,
} from "../controller/admin.auth.Controller.js";
import { adminAuth } from "../middlewares/authMiddleware.js";
import {
  addSongs,
  editSongs,
  deleteSongs,
  getAllSongs,
} from "../controller/admin.Song.Controller.js";
import { getAllUsers, blockUser } from "../controller/admin.User.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//1.auth routes of admin
router
  .post("/login", tryCatch(adminLogin))
  .delete("/logout", adminAuth, tryCatch(adminLogout));

//2.user control routes of admin
router
  .get("/getAllUsers", adminAuth, tryCatch(getAllUsers))
  .put("/blockUser/:id", adminAuth, tryCatch(blockUser));

//3.song routes of admin
router
  .post("/addSongs", adminAuth, upload, tryCatch(addSongs))
  .put("/editSongs/:id", adminAuth, upload, tryCatch(editSongs))
  .delete("/deleteSongs/:id", adminAuth, tryCatch(deleteSongs))
  .get("/getAllSongs", adminAuth, tryCatch(getAllSongs));

export default router;
