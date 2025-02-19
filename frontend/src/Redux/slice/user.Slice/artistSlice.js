import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

const getArtist = createAsyncThunk("artist/getArtist", async () => {
  try {
    const response = await axiosInstance.get("/user/get-artist");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
});

const artistSlice = createSlice({
  name: "artist",
  initialState: {
    artist: [],
    status: "none",
    error: null,
  },
  extraReducers: (Builder) => {
    Builder.addCase(getArtist.pending, (state, action) => {
      state.status = "pending";
    })
      .addCase(getArtist.fulfilled, (state, action) => {
        state.artist = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.status = "none";
      })
      .addCase(getArtist.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error;
      });
  },
});

export default artistSlice.reducer;
export { getArtist };

