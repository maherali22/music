import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

const getAlbums = createAsyncThunk("album/getAlbums", async () => {
  try {
    const response = await axiosInstance.get("/user/get-album");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
});

const albumSlice = createSlice({
  name: "albums",
  initialState: {
    albums: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAlbums.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getAlbums.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.albums = action.payload;
      })
      .addCase(getAlbums.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      });
  },
});

export default albumSlice.reducer;
export { getAlbums };
