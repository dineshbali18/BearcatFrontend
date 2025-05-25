import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import tempUserReducer from './slices/tempUserSlice';

const store = configureStore({
  reducer: {
    tempUser: tempUserReducer,
    user: userReducer,
  },
});

export default store;
