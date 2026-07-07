import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchDashboardStats = createAsyncThunk('admin/stats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/stats');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchCustomers = createAsyncThunk('admin/customers', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/customers', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: { stats: null, customers: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCustomers.fulfilled, (state, action) => { state.customers = action.payload.customers; });
  },
});

export default adminSlice.reducer;
