import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + "/admin",
  }),
  endpoints: (builder) => ({
    adminLogin: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAdminLoginMutation } = adminAuthApi;