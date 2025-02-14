import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

const getPlaylist = createAsyncThunk("playlist/getPlaylist", async () => {
  try {
    const response = await axiosInstance.get("/user/get-all-playlist");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
});

const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    playlist: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylist.pending, (state) => {
        state.status = "pending";
        state.error = null; // Clear previous errors when a new request starts
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
export { getPlaylist };
