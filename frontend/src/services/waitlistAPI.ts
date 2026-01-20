import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const waitlistApi = createApi({
  reducerPath: "waitlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
  }),
  endpoints: (builder) => ({
    joinWaitlist: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/api/comingsoon",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useJoinWaitlistMutation } = waitlistApi;
