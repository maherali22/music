import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

const getAllSongs = createAsyncThunk(
  "songs/getAllSongs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/songs");
      return response.data.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const songSlice = createSlice({
  name: "songs",
  initialState: {
    songs: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSongs.pending, (state) => {
        state.status = "pending";
        state.error = null; // Clear previous errors when a new request starts
      })
      .addCase(getAllSongs.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.songs = action.payload;
      })
      .addCase(getAllSongs.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      });
  },
});

export default songSlice.reducer;
export { getAllSongs };
