import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  email?: string;
  hasBusinessProfile: boolean;
  isOnboarded?: boolean; // ✅ NEW
}

interface AuthState {
  token: string | null;
  user: User | null;
  isOnboarded: boolean; // ✅ NEW (source of truth)
}

/* ================= INITIAL STATE ================= */

const token = localStorage.getItem("token");
const tokenExpiry = localStorage.getItem("tokenExpiry");

const isExpired =
  !tokenExpiry || Date.now() > Number(tokenExpiry);

const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

const initialState: AuthState = {
  token: !isExpired ? token : null,
  user: !isExpired ? storedUser : null,
  isOnboarded: !isExpired
    ? storedUser?.isOnboarded ?? storedUser?.hasBusinessProfile ?? false
    : false,
};

if (isExpired) {
  localStorage.clear();
}

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ---------- LOGIN / RESTORE SESSION ---------- */
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isOnboarded =
        action.payload.user?.isOnboarded ??
        action.payload.user?.hasBusinessProfile ??
        false;

      // persist
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
      );
    },

    /* ---------- STRIPE ONBOARDING SUCCESS ---------- */
    setOnboardingStatus: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isOnboarded = action.payload;

      if (state.user) {
        state.user.isOnboarded = action.payload;
        localStorage.setItem(
          "user",
          JSON.stringify(state.user)
        );
      }
    },

    /* ---------- LOGOUT ---------- */
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isOnboarded = false;
      localStorage.clear();
    },
  },
});

export const {
  setCredentials,
  setOnboardingStatus,
  logout,
} = authSlice.actions;

export default authSlice.reducer;