import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

// Async thunk to get all users
const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/getAllUsers");
      // Expecting the controller to return an object: { data: users }
      return response.data.data;
    } catch (error) {
      console.error(
        "Error in getAllUsers:",
        error.response?.data?.message || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

// Async thunk to block/unblock a user
const blockUser = createAsyncThunk(
  "admin/blockUser",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/blockUser/${userId}`);
      // Expecting the controller to return an object: { data: updatedUser }
      return response.data.data;
    } catch (error) {
      console.error(
        "Error in blockUser:",
        error.response?.data?.message || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState: {
    users: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllUsers cases
      .addCase(getAllUsers.pending, (state) => {
        state.status = "pending";
        state.error = null; // Clear previous errors when a new request starts
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      })
      // blockUser cases
      .addCase(blockUser.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // Update the user in the state list if the ID matches
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      });
  },
});

export default adminUserSlice.reducer;
export { getAllUsers, blockUser };
