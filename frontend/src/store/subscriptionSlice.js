import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subscriptions';

// Toggle subscription to a channel
export const toggleSubscription = createAsyncThunk(
  'subscriptions/toggle',
  async (channelId, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/channel/${channelId}/toggle`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to toggle subscription');
    }
  }
);

// Subscription slice
const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    status: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
