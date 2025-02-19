import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

// Fetch liked songs
export const getLikedSongs = createAsyncThunk("songs/getLikedSongs", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/user/get-liked-songs");
    if (!response.data) throw new Error("No data received");
    return response.data.data;
  } catch (error) {
    console.error("API error:", error);
    return rejectWithValue(error.response?.data || "Failed to fetch liked songs");
  }
});

// Add song to liked songs
export const addToLikedSongs = createAsyncThunk("songs/addToLikedSongs", async (songId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/user/add-to-liked-songs", { songId });
    return response.data.data;
  } catch (error) {
    console.error("API error:", error);
    return rejectWithValue(error.response?.data || "Failed to add song to liked songs");
  }
});

// Remove song from liked songs
export const removeFromLikedSongs = createAsyncThunk("songs/removeFromLikedSongs", async (songId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete("/user/remove-from-liked-songs", { data: { songId } });
    return response.data.data;
  } catch (error) {
    console.error("API error:", error);
    return rejectWithValue(error.response?.data || "Failed to remove song from liked songs");
  }
});

const likedSongsSlice = createSlice({
  name: "likedSongs",
  initialState: {
    likedSongs: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLikedSongs.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getLikedSongs.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.likedSongs = action.payload;
      })
      .addCase(getLikedSongs.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      });
  },
});

export default likedSongsSlice.reducer;