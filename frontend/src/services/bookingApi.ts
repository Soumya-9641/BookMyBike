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
  }),
});

export const { useCreateBookingMutation, useGetMyBookingsQuery,
  useGetOwnerBookingsQuery, useGetProfileQuery, useUpdateProfileMutation, useGetMyRefundsQuery, useGetMyListingsQuery } = bookingApi;
