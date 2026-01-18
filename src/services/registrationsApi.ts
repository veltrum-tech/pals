import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CreateRegistrationRequest,
  CreateRegistrationResponse,
  VerifyVinForRegistrationRequest,
  VerifyVinForRegistrationResponse,
  UploadRegistrationDocumentsResponse,
  InitiateRegistrationPaymentRequest,
  InitiateRegistrationPaymentResponse,
  VerifyRegistrationPaymentRequest,
  VerifyRegistrationPaymentResponse,
  SubmitRegistrationReviewRequest,
  SubmitRegistrationReviewResponse,
} from "../types/registrations";

// Base URL - update this with your actual API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID || "jigawa";

export const registrationsApi = createApi({
  reducerPath: "registrationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("X-Tenant-ID", TENANT_ID);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Registration"],
  endpoints: (builder) => ({
    // Verify VIN for global check (before creating registration)
    verifyVinForRegistration: builder.mutation<
      VerifyVinForRegistrationResponse,
      VerifyVinForRegistrationRequest
    >({
      query: (body) => ({
        url: "/registrations/verify-vin",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Create a new vehicle registration request
    createRegistration: builder.mutation<
      CreateRegistrationResponse,
      CreateRegistrationRequest
    >({
      query: (body) => ({
        url: "/registrations",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Registration"],
    }),

    // Upload registration documents
    uploadRegistrationDocuments: builder.mutation<
      UploadRegistrationDocumentsResponse,
      { requestId: string; files: Array<{ file: File; documentType: string }> }
    >({
      query: ({ requestId, files }) => {
        const formData = new FormData();
        files.forEach(({ file, documentType }) => {
          formData.append("file", file);
          formData.append("documentType", documentType);
        });
        return {
          url: `/registrations/${requestId}/documents`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Registration"],
    }),

    // Initiate payment for registration
    initiateRegistrationPayment: builder.mutation<
      InitiateRegistrationPaymentResponse,
      { requestId: string; data: InitiateRegistrationPaymentRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/registrations/${requestId}/payment`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Registration"],
    }),

    // Verify payment status for registration
    verifyRegistrationPayment: builder.mutation<
      VerifyRegistrationPaymentResponse,
      { requestId: string; data: VerifyRegistrationPaymentRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/registrations/${requestId}/verify-payment`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Registration"],
    }),

    // Submit admin review (approve/reject)
    submitRegistrationReview: builder.mutation<
      SubmitRegistrationReviewResponse,
      { requestId: string; data: SubmitRegistrationReviewRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `/registrations/${requestId}/review`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Registration"],
    }),
  }),
});

export const {
  useVerifyVinForRegistrationMutation,
  useCreateRegistrationMutation,
  useUploadRegistrationDocumentsMutation,
  useInitiateRegistrationPaymentMutation,
  useVerifyRegistrationPaymentMutation,
  useSubmitRegistrationReviewMutation,
} = registrationsApi;
