import { baseApi } from "./baseApi";

export interface CreateCustomerResponse {
  stripeCustomerId: string;
  message: string;
}

export interface CreateConnectAccountResponse {
  accountId: string;
  message?: string;
}

export interface OnboardResponse {
  url: string;
}

export const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ───────────── RENTER ───────────── */

    createStripeCustomer: builder.mutation<CreateCustomerResponse, void>({
      query: () => ({
        url: "/checkout/createcustomer",
        method: "POST",
      }),
    }),

    /** ───────────── OWNER ───────────── */

    createConnectAccount: builder.mutation<CreateConnectAccountResponse, void>({
      query: () => ({
        url: "/checkout/create-connect-account",
        method: "POST",
      }),
    }),

    startStripeOnboarding: builder.query<OnboardResponse, void>({
      query: () => ({
        url: "/checkout/connect/onboard",
        method: "GET",
      }),
    }),

    // services/stripeApi.ts
    completeRide: builder.mutation<
      { success: boolean },
      { bookingId: string; status: "inprogress" | "completed" }
    >({
      query: ({ bookingId, status }) => ({
        url: `checkout/${bookingId}/complete-ride`,
        method: "POST",
        body: { status },
      }),
    }),
  }),
})
export const {
  useCreateStripeCustomerMutation,
  useCreateConnectAccountMutation,
  useLazyStartStripeOnboardingQuery,
  useCompleteRideMutation,
} = stripeApi;