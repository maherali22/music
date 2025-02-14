import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

// Async thunk for user login
export const userLogin = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", userData);
      return response.data.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
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
      const errMsg = error.response
        ? error.response.data.message
        : "Failed to edit user.";
      return rejectWithValue(errMsg);
    }
  }
);

// Retrieve current user from localStorage (if available)
// If parsing fails, log the error and return the plain string or null.
const activeUser = (() => {
  const userString = localStorage.getItem("currentUser");
  if (userString && userString !== "undefined") {
    try {
      const parsedUser = JSON.parse(userString);
      console.log("Parsed currentUser:", parsedUser);
      return parsedUser;
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

// User slice definition
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      try {
        state.user = null;
        state.status = null;
        state.token = null;
        state.refreshmentToken = null;
        state.profilePicture = null;
        state.admin = null;
        state.id = null;

        // Clear all related localStorage items
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshmentToken");
        localStorage.removeItem("profilePicture");
        localStorage.removeItem("admin");
        localStorage.removeItem("persist:root");
      } catch (error) {
        console.error("Error during logout:", error);
      }
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
          profilePicture:
            action.payload.profilePicture || action.payload.user.profilePic,
          id: action.payload._id || action.payload.user._id,
          admin: action.payload.admin || action.payload.user.admin,
        };

        // Handle parsing of user data
        if (typeof userData.user === "string") {
          try {
            userData.user = JSON.parse(userData.user);
          } catch (error) {
            console.warn(
              `User data is not valid JSON. Wrapping plain string "${userData.user}" in an object.`
            );
            userData.user = { name: userData.user };
          }
        }

        // Add default values for missing fields
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

        // Update state with parsed user data
        state.user = userData.user;
        state.status = "fulfilled";
        state.token = userData.token;
        state.refreshmentToken = userData.refreshmentToken;
        state.profilePicture = userData.profilePicture;
        state.admin = userData.admin;
        state.id = userData.id;

        // Store user data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(userData.user));
        localStorage.setItem("token", userData.token);
        localStorage.setItem("refreshmentToken", userData.refreshmentToken);
        localStorage.setItem(
          "profilePicture",
          JSON.stringify(userData.profilePicture)
        );
        localStorage.setItem("admin", userData.admin);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        // Update user and profile picture in state
        state.user = {
          ...state.user,
          name: action.payload.name,
          profilePic:
            action.payload.profilePicture || action.payload.profilePic,
        };
        state.status = "fulfilled";

        // Store updated user data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(state.user));
        localStorage.setItem(
          "profilePicture",
          JSON.stringify(state.profilePicture)
        );
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
