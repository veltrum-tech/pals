import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  VerifyCertificateRequest,
  VerifyCertificateResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  SubmitTransferRequest,
  SubmitTransferResponse,
  InitiateTransferPaymentRequest,
  InitiateTransferPaymentResponse,
} from "../types/transfers";

// Base URL - update this with your actual API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID || "jigawa";

export const transfersApi = createApi({
  reducerPath: "transfersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("X-Tenant-ID", TENANT_ID);
      headers.set("Accept", "application/json");

      return headers;
    },
  }),
  tagTypes: ["Transfer"],
  endpoints: (builder) => ({
    verifyCertificate: builder.mutation<
      VerifyCertificateResponse,
      VerifyCertificateRequest
    >({
      query: (body) => ({
        url: "/transfers/verify-certificate",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    sendOtp: builder.mutation<
      SendOtpResponse,
      { requestId: string; data: SendOtpRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/transfers/${requestId}/send-otp`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    verifyOtp: builder.mutation<
      VerifyOtpResponse,
      { requestId: string; data: VerifyOtpRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/transfers/${requestId}/verify-otp`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    submitTransfer: builder.mutation<
      SubmitTransferResponse,
      { requestId: string; data: SubmitTransferRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/transfers/${requestId}/submit`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    initiateTransferPayment: builder.mutation<
      InitiateTransferPaymentResponse,
      { requestId: string; data: InitiateTransferPaymentRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/transfers/${requestId}/initiate-payment`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    verifyTransferPayment: builder.mutation<
      VerifyOtpResponse,
      { requestId: string; reference: string }
    >({
      query: ({ requestId, reference }) => ({
        url: `/transfers/${requestId}/verify-payment`,
        method: "POST",
        body: { reference },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useVerifyCertificateMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useSubmitTransferMutation,
  useInitiateTransferPaymentMutation,
  useVerifyTransferPaymentMutation,
} = transfersApi;
