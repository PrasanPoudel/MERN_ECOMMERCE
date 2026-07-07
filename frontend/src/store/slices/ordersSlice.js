import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], total: 0, pages: 0, current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createOrder.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.current?._id === action.payload._id) state.current = action.payload;
      });
  },
});

export default ordersSlice.reducer;
