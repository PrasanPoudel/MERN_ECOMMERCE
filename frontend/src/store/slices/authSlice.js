import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  },
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get("/auth/profile");
      return res.data;
    } catch (err) {
      // Token is invalid or expired — clear it so GuestRoute unblocks
      dispatch(logout());
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put("/auth/profile", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.delete("/auth/account", { data });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete account failed",
      );
    }
  },
);

export const addAddress = createAsyncThunk(
  "auth/addAddress",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/address", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  "auth/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/auth/address/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, rejected)
      .addCase(signup.pending, pending)
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, rejected)
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.user) state.user.addresses = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.user) state.user.addresses = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
