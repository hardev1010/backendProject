import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_URL = 'http://localhost:5000/api/auth';

// 1. Thunk to handle user login
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // Return the user data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

// 2. Thunk to handle user registration
export const register = createAsyncThunk('auth/register', async (userDetails, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userDetails);
    return response.data; // Return the registered user data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

// 3. Create the authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Stores logged-in user info
    loading: false, // Indicates if an async request is in progress
    error: null, // Stores error messages, if any
  },
  reducers: {
    // Clear user data (for logout)
    logout(state) {
      state.user = null;
      localStorage.removeItem('user'); // Clear user data from localStorage
    },
  },
  extraReducers: (builder) => {
    // Handle login actions
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload)); // Save user data to localStorage
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle registration actions
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
