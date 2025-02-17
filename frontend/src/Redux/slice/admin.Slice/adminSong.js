import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

// Async thunk to fetch all songs (admin view)
const getAllAdminSongs = createAsyncThunk(
  "songs/getAllAdminSongs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/getAllSongs");
      return response.data.data;
    } catch (error) {
      console.error(
        "getAllAdminSongs error:",
        error.response?.data?.message || error.message
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to add a song
const addSong = createAsyncThunk(
  "songs/addSong",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin/addSongs", data);
      return response.data.data;
    } catch (error) {
      console.error(
        "addSong error:",
        error.response?.data?.message || error.message
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete a song
const deleteSong = createAsyncThunk(
  "songs/deleteSong",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin/deleteSongs/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(
        "deleteSong error:",
        error.response?.data?.message || error.message
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to edit a song
const editSong = createAsyncThunk(
  "songs/editSong",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/admin/editSongs/${id}`,
        formData
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "editSong error:",
        error.response?.data?.message || error.message
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminSongSlice = createSlice({
  name: "adminSongs",
  initialState: {
    adminSongs: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllAdminSongs cases
      .addCase(getAllAdminSongs.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getAllAdminSongs.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.adminSongs = action.payload;
      })
      .addCase(getAllAdminSongs.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      })
      // addSong cases
      .addCase(addSong.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(addSong.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // Append the newly added song to the list
        state.adminSongs.push(action.payload);
      })
      .addCase(addSong.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      })
      // deleteSong cases
      .addCase(deleteSong.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteSong.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // Remove the deleted song from the list
        state.adminSongs = state.adminSongs.filter(
          (song) => song._id !== action.payload._id
        );
      })
      .addCase(deleteSong.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      })
      // editSong cases
      .addCase(editSong.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(editSong.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // Update the edited song in the list
        state.adminSongs = state.adminSongs.map((song) =>
          song._id === action.payload._id ? action.payload : song
        );
      })
      .addCase(editSong.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      });
  },
});

export default adminSongSlice.reducer;
export { getAllAdminSongs, addSong, deleteSong, editSong };
