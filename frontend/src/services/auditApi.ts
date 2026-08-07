import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const auditApi = createApi({
  reducerPath: "auditApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Audit"],
  endpoints: (builder) => ({
    getAudit: builder.query({
      query: (year: number) => ({
        url: `/audit/generateAudit?year=${year}`,
        method: "POST",
      }),

      providesTags: ["Audit"],
    }),

    createAudit: builder.mutation({
      query: (body) => ({
        url: "/audit/createAudit",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Audit"],
    }),
  }),
});

export const { useGetAuditQuery, useCreateAuditMutation } = auditApi;
