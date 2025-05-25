import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  emailID: null,
  token: null,
  userID: null,
  name: null,
  phoneNumber: null,
};

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.emailID = action.payload.email_id;
      state.token = action.payload.token;
      state.userID = action.payload.user_id;
      state.phoneNumber = action.payload.phone_number;
      state.name = action.payload.name;
    },
    clearUser: (state) => {
      state.emailID = null;
      state.token = null;
      state.userID = null;
      state.phoneNumber = null;
      state.name = null;
    },
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
