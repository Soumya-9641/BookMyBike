// src/services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL + '/user/auth';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    signup: builder.mutation<
      { message: string },
      { firstName: string; lastName: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body
      })
    }),

    login: builder.mutation<
      { token: string; hasBusinessProfile: boolean },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body
      })
    }),

    verifyEmail: builder.query<
      { message: string },
      string
    >({
      query: (token) => ({
        url: "/verify-email",
        params: { token }
      })
    }),
    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: ({ token, password }) => ({
        url: `/reset-password?token=${token}`,
        method: "POST",
        body: { password },
      }),
    }),



    resendVerification: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/resend-verification",
        method: "POST",
        body
      })
    }),
    changePassword: builder.mutation<
      { success: boolean; message: string },
      {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({
        url: "/change-password",
        method: "PUT",
        body,
      }),
    }),
    sendOtp: builder.mutation<
      { success: boolean; message: string },
      { phoneNumber: string }
    >({
      query: (body) => ({
        url: "/send-otp",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<
      { success: boolean; verified: boolean; message: string },
      { phoneNumber: string; otp: string }
    >({
      query: (body) => ({
        url: "/verify-otp",
        method: "POST",
        body,
      }),
    }),
  })
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyEmailQuery,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
