import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

// Async thunk for user login
export const userLogin = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", userData);
      console.log("Response user:", response.data.data);
      return response.data.data;
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      }
      console.error("Login error:", error.message);
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

// Async thunk for editing user profile
export const editUser = createAsyncThunk(
  "user/editUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/user/edituser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error.response) {
        console.error("Edit user error:", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      }
      console.error("Edit user error:", error.message);
      return rejectWithValue("Failed to edit user.");
    }
  }
);

// Retrieve current user from localStorage (if available)
const activeUser = (() => {
  const userString = localStorage.getItem("currentUser");
  if (userString && userString !== "undefined") {
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing current user:", error);
      return null;
    }
  }
  return null;
})();

// Initial state setup
const initialState = {
  user: activeUser,
  status: null,
  token: localStorage.getItem("token") || null,
  refreshmentToken: localStorage.getItem("refreshmentToken") || null,
  profilePicture: localStorage.getItem("profilePicture")
    ? JSON.parse(localStorage.getItem("profilePicture"))
    : null,
  error: null,
  admin: null,
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = null;
      state.token = null;
      state.refreshmentToken = null;
      state.profilePicture = null;
      state.admin = null;
      state.id = null;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshmentToken");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("admin");
      localStorage.removeItem("persist:root");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.user = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        const userData = {
          user: action.payload.user,
          token: action.payload.token,
          refreshmentToken: action.payload.refreshmentToken,
          profilePicture: action.payload.user.profilePic || "",
          id: action.payload.user._id || "",
          admin: action.payload.user.admin || false,
        };

        // Ensure default values for missing fields
        userData.user = {
          _id: userData.user._id || "",
          name: userData.user.name || "Guest",
          email: userData.user.email || "",
          profilePicture: userData.user.profilePic || "",
          admin: userData.user.admin || false,
          isVerified: userData.user.isVerified || false,
          likedSongs: userData.user.likedSongs || [],
          blocked: userData.user.blocked || false,
        };

        state.user = userData.user;
        state.status = "fulfilled";
        state.token = userData.token;
        state.refreshmentToken = userData.refreshmentToken;
        state.profilePicture = userData.profilePic;
        state.admin = userData.admin;
        state.id = userData.id;

        // Persist user data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(userData.user));
        localStorage.setItem("token", userData.token);
        localStorage.setItem("refreshmentToken", userData.refreshmentToken);
        localStorage.setItem(
          "profilePicture",
          JSON.stringify(userData.profilePicture)
        );
        localStorage.setItem("admin", userData.admin);
      })

      .addCase(userLogin.rejected, (state, action) => {
        state.user = null;
        state.status = "rejected";
        state.error = action.payload || "Login failed.";
      })
      .addCase(editUser.pending, (state) => {
        state.status = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        // Update the user's name and profile picture
        state.user = {
          ...state.user,
          name: action.payload.name,
          profilePic:
            action.payload.profilePicture || action.payload.profilePic,
        };
        state.status = "fulfilled";

        localStorage.setItem("currentUser", JSON.stringify(state.user));
        localStorage.setItem(
          "profilePicture",
          JSON.stringify(state.profilePicture)
        );
      })
      .addCase(editUser.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
