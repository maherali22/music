import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

const getLikedSongs = createAsyncThunk("songs/getLikedSongs", async () => {
  try {
    const response = await axiosInstance.get("/user/get-liked-songs");
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
});

const addToLikedSongs = createAsyncThunk(
  "songs/addToLikedSongs",
  async (songId) => {
    try {
      const response = await axiosInstance.post("/user/add-to-liked-songs", {
        songId,
      });
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  }
);

const removeFromLikedSongs = createAsyncThunk(
  "songs/removeFromLikedSongs",
  async (songId) => {
    try {
      const response = await axiosInstance.delete(
        "/user/remove-from-liked-songs",
        { songId }
      );
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  }
);

const likedSongsSlice = createSlice({
  name: "likedSongs",
  initialState: {
    likedSongs: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (Builder) => {
    Builder.addCase(getLikedSongs.pending, (state, action) => {
      state.status = "pending";
    })
      .addCase(getLikedSongs.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.likedSongs = action.payload;
      })
      .addCase(getLikedSongs.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error;
      });
  },
});

export default likedSongsSlice.reducer;
export { getLikedSongs, addToLikedSongs, removeFromLikedSongs };
