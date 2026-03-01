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
    
    completeRide: builder.mutation<
      {
        message: string;
        depositRefund: {
          refundId: string;
          amount: number;
        };
        ownerPayout: {
          transferId: string;
          amount: number;
        };
      },
      string // bookingId
    >({
      query: (bookingId) => ({
        url: `/checkout/${bookingId}/complete-ride`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateStripeCustomerMutation,
  useCreateConnectAccountMutation,
  useLazyStartStripeOnboardingQuery,
  useCompleteRideMutation,
} = stripeApi;