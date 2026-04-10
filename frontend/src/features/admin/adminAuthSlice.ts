import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Admin {
  adminId: string;
  email: string;
  systemRole: "admin";
  firstName?: string | null;
  lastName?: string | null;
}

interface AdminAuthState {
  adminToken: string | null;
  admin: Admin | null;
  hydrated: boolean;
}

const initialState: AdminAuthState = {
  adminToken: null,
  admin: null,
  hydrated: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    hydrateAdminAuth: (
      state,
      action: PayloadAction<{ adminToken: string | null; admin: Admin | null }>
    ) => {
      state.adminToken = action.payload.adminToken;
      state.admin = action.payload.admin;
      state.hydrated = true;
    },

    setAdminCredentials: (
      state,
      action: PayloadAction<{ adminToken: string; admin: Admin }>
    ) => {
      state.adminToken = action.payload.adminToken;
      state.admin = action.payload.admin;
      state.hydrated = true;

      localStorage.setItem("adminToken", action.payload.adminToken);
      localStorage.setItem("admin", JSON.stringify(action.payload.admin));
    },

    adminLogout: (state) => {
      state.adminToken = null;
      state.admin = null;
      state.hydrated = true;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
    },
  },
});

export const {
  hydrateAdminAuth,
  setAdminCredentials,
  adminLogout,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;