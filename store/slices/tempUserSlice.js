// redux/slices/tempUserSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  username: "",
  phoneNum: "",
};

const tempUserSlice = createSlice({
  name: "tempUser",
  initialState,
  reducers: {
    setTempUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearTempUser: () => initialState,
  },
});

export const { setTempUser, clearTempUser } = tempUserSlice.actions;
export default tempUserSlice.reducer;
