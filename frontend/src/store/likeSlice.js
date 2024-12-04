import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/likes';

// Toggle like on a video
export const toggleVideoLike = createAsyncThunk('likes/toggleVideo', async (videoId, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/video/${videoId}/toggle`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
  }
});

// Like slice
const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    status: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
