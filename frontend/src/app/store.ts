// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import authReducer from "../features/auth/authSlice";
import { waitlistApi } from "../services/waitlistAPI";
import { baseApi } from "../services/baseApi";
import { adminApi } from "../services/adminApi";
import adminAuthReducer from "../features/admin/adminAuthSlice";
import { adminAuthApi } from "../services/adminAuthApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [waitlistApi.reducerPath]: waitlistApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    auth: authReducer,
    adminAuth: adminAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, waitlistApi.middleware, baseApi.middleware, adminApi.middleware, adminAuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
