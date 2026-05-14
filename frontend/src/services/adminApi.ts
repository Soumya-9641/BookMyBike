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
  tagTypes: ["Users", "Stats", "Disputes", "Dispute", "AdminListings"],
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
      {
        success: boolean;
        dispute: any;
        message: string;
      },
      {
        disputeId: string;
        status: "resolved" | "rejected";
      }
    >({
      query: ({ disputeId, status }) => ({
        url: "/disputes/updateDispute",
        method: "PATCH",
        body: {
          disputeId,
          status,
        },
      }),
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
      
    }),
    completeAdminRide: builder.mutation<
      { success: boolean },
      { bookingId: string; status: "inprogress" | "completed" }
    >({
      query: ({ bookingId, status }) => ({
        url: `checkout/${bookingId}/complete-ride`,
        method: "POST",
        body: { status },
      }),
    }),
    editListingAsAdmin: builder.mutation<
      any,
      { listingId: string; data: FormData }
    >({
      query: ({ listingId, data }) => ({
        url: `/adminstats/${listingId}/edit`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdminListings"],
    }),
    

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
  useEditListingAsAdminMutation,
  useCompleteAdminRideMutation,
} = adminApi;