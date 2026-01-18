import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  VerifyVinRequest,
  VerifyVinResponse,
  SubmitInfoRequest,
  SubmitInfoResponse,
  UploadCertificateResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  VerifyPaymentResponse,
} from "../types/migrations";

// Base URL - update this with your actual API URL
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL
const TENANT_ID = import.meta.env.VITE_TENANT_ID || "jigawa";


export const migrationsApi = createApi({
  reducerPath: "migrationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("X-Tenant-ID", TENANT_ID);
      headers.set("Accept", "application/json");
      // Don't set Content-Type here - let it be set per request
      return headers;
    },
  }),
  tagTypes: ["Migration"],
  endpoints: (builder) => ({
    verifyVin: builder.mutation<VerifyVinResponse, VerifyVinRequest>({
      query: (body) => ({
        url: "/migrations/verify-vin",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    submitInfo: builder.mutation<
      SubmitInfoResponse,
      { requestId: string; data: SubmitInfoRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/migrations/${requestId}/submit-info`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    uploadCertificate: builder.mutation<
      UploadCertificateResponse,
      { requestId: string; file: File }
    >({
      query: ({ requestId, file }) => {
        const formData = new FormData();
        formData.append("certificate", file);
        return {
          url: `/migrations/${requestId}/upload-certificate`,
          method: "POST",
          body: formData,
          // Don't set Content-Type for FormData - browser will set it with boundary
        };
      },
    }),
    initiatePayment: builder.mutation<
      InitiatePaymentResponse,
      { requestId: string; data: InitiatePaymentRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/migrations/${requestId}/initiate-payment`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    verifyPayment: builder.mutation<
      VerifyPaymentResponse,
      { requestId: string, reference: string }
    >({
      query: ({ requestId, reference }) => ({
        url: `/migrations/${requestId}/verify-payment`,
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
  useVerifyVinMutation,
  useSubmitInfoMutation,
  useUploadCertificateMutation,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
} = migrationsApi;
