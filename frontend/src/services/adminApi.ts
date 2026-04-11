import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Users", "Stats", "Disputes", "Dispute"],
  endpoints: (builder) => ({
    /* ---------------- USERS ---------------- */
    getAllUsers: builder.query<any, void>({
      query: () => "/adminstats/users",
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/adminstats/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    /* ---------------- STATS ---------------- */
    getAdminStats: builder.query<any, void>({
      query: () => "/adminstats/stats",
      providesTags: ["Stats"],
    }),

    /* ---------------- ADD ADMIN ---------------- */
    addAdmin: builder.mutation<any, any>({
      query: (body) => ({
        url: "/adminstats/addAdmin",
        method: "POST",
        body,
      }),
    }),

    /* ---------------- USER BOOKINGS ---------------- */
    getUserBookingSummary: builder.query<any, string>({
      query: (userId) => `/adminstats/${userId}/bookings`,
    }),
    getAllDisputes: builder.query<any, void>({
      query: () => "/disputes/getall",
      providesTags: ["Disputes"],
    }),

    getDisputeDetail: builder.query<any, string>({
      query: (disputeId) => `/disputes/dispute/${disputeId}`,
      providesTags: ["Dispute"],
    }),

    updateDispute: builder.mutation<
      any,
      { disputeId: string; body: { status: string; reason?: string } }
    >({
      query: ({ disputeId, body }) => ({
        url: `/disputes/updateDispute/${disputeId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Disputes", "Dispute"],
    }),
    getAllBookings: builder.query<any[], void>({
      query: () => "/adminstats/allbookings",
      transformResponse: (res: any) => res.bookings,
    }),

    getAllListings: builder.query<any[], void>({
      query: () => "/adminstats/alllistings",
      transformResponse: (res: any) => res.listings,
    }),

    changeAdminPassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/adminstats/changePassword",
        method: "PATCH",
        body,
      }),
    })

  }),

});

export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetAdminStatsQuery,
  useAddAdminMutation,
  useGetUserBookingSummaryQuery,
  useGetAllDisputesQuery,
  useGetDisputeDetailQuery,
  useUpdateDisputeMutation,
  useGetAllBookingsQuery,
  useGetAllListingsQuery,
  useChangeAdminPasswordMutation,
} = adminApi;