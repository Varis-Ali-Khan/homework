import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchStats = createAsyncThunk('providers/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/stats');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchProviders = createAsyncThunk('providers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/providers');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch providers');
  }
});

export const toggleSubscription = createAsyncThunk('providers/toggleSub', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/admin/providers/${id}/subscription`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update subscription');
  }
});

export const deleteProvider = createAsyncThunk('providers/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/providers/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete provider');
  }
});

const providersSlice = createSlice({
  name: 'providers',
  initialState: { list: [], stats: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; })
      .addCase(fetchProviders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProviders.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchProviders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteProvider.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export default providersSlice.reducer;
