import { baseApi } from "./baseApi";

export interface CreateBookingPayload {
  listingId: string;
  startDate: string;
  endDate: string;
  hours: number;
}

export interface CreateBookingResponse {
  bookingId: string;
  clientSecret: string;
  customerId: string;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<
      CreateBookingResponse,
      CreateBookingPayload
    >({
      query: (body) => ({
        url: "/bookings/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateBookingMutation } = bookingApi;
