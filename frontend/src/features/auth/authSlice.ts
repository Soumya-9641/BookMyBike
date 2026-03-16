import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
 user: {
    email?: string;
    hasBusinessProfile: boolean; // 🔥 single flag
  } | null;
}

const initialState: AuthState = {
  token:
    localStorage.getItem("token") ||
    sessionStorage.getItem("token"),
  user: localStorage.getItem("hasBusinessProfile")
    ? {
        hasBusinessProfile:
          localStorage.getItem("hasBusinessProfile") === "true",
      }
    : null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: any }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } =
  authSlice.actions;

export default authSlice.reducer;
