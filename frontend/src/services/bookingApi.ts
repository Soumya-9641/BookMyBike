import { baseApi } from "./baseApi";
import type { Booking, CreateBookingResponse, CreateBookingPayload, UserProfile } from "../types/listing";

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
      query: () => "/mybookings",
      providesTags: ["Listing"],
    }),

    getOwnerBookings: builder.query<{ count: number; bookings: Booking[] }, void>({
      query: () => "/ownerbookings",
      providesTags: ["Listing"],
    }),
    getProfile: builder.query<{ success: boolean; data: UserProfile }, void>({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateBookingMutation, useGetMyBookingsQuery,
  useGetOwnerBookingsQuery, useGetProfileQuery } = bookingApi;
