import { baseApi } from "./baseApi";
import type { Booking, CreateBookingResponse, CreateBookingPayload, UserProfileUpdatePayload, ProfileForm } from "../types/listing";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<
      CreateBookingResponse,
      CreateBookingPayload
    >({
      query: (body) => ({
        url: "/checkout/create",
        method: "POST",
        body,
      }),
    }),
    getMyBookings: builder.query<{ count: number; bookings: Booking[] }, void>({
      query: () => "/dashboard/mybookings",
      providesTags: ["Booking"],
    }),

    getOwnerBookings: builder.query<{ count: number; bookings: Booking[] }, void>({
      query: () => "/dashboard/ownerbookings",
      providesTags: ["Booking"],
    }),
    getProfile: builder.query<
      { success: boolean; data: ProfileForm; isStripeConnected: boolean },
      void
    >({
      query: () => "/dashboard/profile",
    }),

    updateProfile: builder.mutation<
      { success: boolean; data: ProfileForm },
      UserProfileUpdatePayload
    >({
      query: (body) => ({
        url: "/dashboard/profile",
        method: "PUT",
        body,
      }),
    }),
    getMyRefunds: builder.query<
      { count: number; bookings: Booking[] },
      void
    >({
      query: () => "/dashboard/myrefunds",
      providesTags: ["Booking"],
    }),
    getMyListings: builder.query<
      {
        count: number;
        listings: any[];
      },
      void
    >({
      query: () => "/dashboard/mylistings",
      providesTags: ["Listing"],
    }),
    createDispute: builder.mutation<
      any,
      {
        bookingId: string;
        disputeAmount: number;
        reason: string;
        date: Date;
        time: string;
      }
    >({
      query: (body) => ({
        url: "/disputes/createDispute",
        method: "POST",
        body,
      }),

    }),
    requestRideStart: builder.mutation<
      any,
      { bookingId: string }
    >({
      query: ({ bookingId }) => ({
        url: `/bike/listing/${bookingId}/request-start`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking"],
    }),

    acceptRideStart: builder.mutation<
      any,
      { bookingId: string }
    >({
      query: ({ bookingId }) => ({
        url: `/bike/listing/${bookingId}/accept-start`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking"],
    }),

    /* ============================
       RIDE COMPLETION FLOW
    ============================ */

    requestRideCompletion: builder.mutation<
      any,
      { bookingId: string }
    >({
      query: ({ bookingId }) => ({
        url: `/bike/listing/${bookingId}/request-completion`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking"],
    }),

    confirmRideCompletion: builder.mutation<
      any,
      { bookingId: string }
    >({
      query: ({ bookingId }) => ({
        url: `/bike/listing/${bookingId}/confirm-completion`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking"],
    }),

  }),
});

export const { useCreateBookingMutation, useGetMyBookingsQuery,
  useGetOwnerBookingsQuery, useGetProfileQuery, useUpdateProfileMutation, useGetMyRefundsQuery, useGetMyListingsQuery, useCreateDisputeMutation, useRequestRideStartMutation, useAcceptRideStartMutation, useRequestRideCompletionMutation, useConfirmRideCompletionMutation } = bookingApi;
