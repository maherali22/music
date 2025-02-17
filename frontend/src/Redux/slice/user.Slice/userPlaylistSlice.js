import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

const getUserPlaylist = createAsyncThunk(
  "playlist/getUserPlaylist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/get-playlist");
      if (!response.data) {
        throw new Error("No data received");
      }
      console.log("playlist data:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch playlists"
      );
    }
  }
);

const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async ({ playlistName, songsId }) => {
    try {
      const response = await axiosInstance.post("/user/create-playlist", {
        playlistName,
        songs: songsId,
      });
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async ({ playlistId }) => {
    try {
      const response = await axiosInstance.delete(
        `/user/delete-playlist/${playlistId}`
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const deleteSongFromPlaylist = createAsyncThunk(
  "playlist/deleteSongFromPlaylist",
  async ({ playlistId, songId }) => {
    try {
      const response = await axiosInstance.delete(
        "/user/delete-song-from-playlist",
        {
          data: {
            playlistId,
            songId,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const userPlaylistSlice = createSlice({
  name: "userPlaylist",
  initialState: {
    userPlaylist: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPlaylist.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getUserPlaylist.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.userPlaylist = action.payload;
      })
      .addCase(getUserPlaylist.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      });
  },
});

export default userPlaylistSlice.reducer;
export {
  getUserPlaylist,
  createPlaylist,
  deletePlaylist,
  deleteSongFromPlaylist,
};
