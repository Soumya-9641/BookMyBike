import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  email?: string;
  hasBusinessProfile: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const token = localStorage.getItem("token");
const tokenExpiry = localStorage.getItem("tokenExpiry");

const isExpired =
  !tokenExpiry || Date.now() > Number(tokenExpiry);

const initialState: AuthState = {
  token: !isExpired ? token : null,
  user: !isExpired && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

if (isExpired) {
  localStorage.clear();
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;