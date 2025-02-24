import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  user: null,
  token: null,
  message: null,
};

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.message = action.payload.message;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.message = null;
    },
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
