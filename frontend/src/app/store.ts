// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import authReducer from "../features/auth/authSlice";
import { waitlistApi } from "../services/waitlistAPI";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [waitlistApi.reducerPath]: waitlistApi.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,waitlistApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
