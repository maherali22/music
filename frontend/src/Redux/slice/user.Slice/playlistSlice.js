import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

export const getPlaylist = createAsyncThunk(
  "playlist/getPlaylist",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/user/get-all-playlist");
      return response.data.data;
    } catch (error) {
      // Reject with error payload to be handled in extraReducers
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    // You might consider renaming this to 'playlists' for clarity
    playlist: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylist.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getPlaylist.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.playlist = action.payload;
      })
      .addCase(getPlaylist.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      });
  },
});

export default playlistSlice.reducer;
