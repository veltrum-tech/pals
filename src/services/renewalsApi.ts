import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  InitiateRenewalRequest,
  InitiateRenewalResponse,
  VerifyRenewalPaymentRequest,
  VerifyRenewalPaymentResponse,
} from "../types/renewals";

// Base URL - update this with your actual API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID || "jigawa";

export const renewalsApi = createApi({
  reducerPath: "renewalsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("X-Tenant-ID", TENANT_ID);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Renewal"],
  endpoints: (builder) => ({
    // Initiate vehicle renewal (Lookup + Payment generation)
    initiateRenewal: builder.mutation<
      InitiateRenewalResponse,
      InitiateRenewalRequest
    >({
      query: (body) => ({
        url: "/renewals",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Renewal"],
    }),

    // Verify payment and auto-approve renewal
    verifyRenewalPayment: builder.mutation<
      VerifyRenewalPaymentResponse,
      { requestId: string; data: VerifyRenewalPaymentRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/renewals/${requestId}/verify-payment`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Renewal"],
    }),
  }),
});

export const { useInitiateRenewalMutation, useVerifyRenewalPaymentMutation } =
  renewalsApi;
