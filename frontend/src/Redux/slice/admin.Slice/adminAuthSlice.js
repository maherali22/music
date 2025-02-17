import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

const adminLogin = createAsyncThunk(
  "admin/adminLogin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin/login", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const activeUser = (() => {
  try {
    const userString = localStorage.getItem("adminUser");
    return userString ? JSON.parse(userString) : null;
  } catch {
    return null;
  }
})();

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    user: activeUser?.user || null,
    status: activeUser ? "fulfilled" : "none",
    token: activeUser?.token || null,
    error: null,
    isAdmin: activeUser?.isAdmin || false,
  },
  reducers: {
    adminLogout: (state) => {
      state.user = null;
      state.status = "none";
      state.token = null;
      state.error = null;
      state.isAdmin = false;
      localStorage.removeItem("adminUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        const { adminName, token, isAdmin } = action.payload;
        state.status = "fulfilled";
        state.user = adminName;
        state.token = token;
        state.isAdmin = isAdmin;
        state.error = null;
        
        localStorage.setItem("adminUser", JSON.stringify({
          user: adminName,
          token,
          isAdmin
        }));
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
export const { adminLogout } = adminSlice.actions;
export { adminLogin };