import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CalculateValuationRequest,
  ValuationResponse,
} from "../types/valuation";

// Base URL - update this with your actual API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID || "jigawa";

export const valuationApi = createApi({
  reducerPath: "valuationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("X-Tenant-ID", TENANT_ID);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Valuation"],
  endpoints: (builder) => ({
    // Calculate vehicle valuation and duties
    calculateValuation: builder.mutation<
      ValuationResponse,
      CalculateValuationRequest
    >({
      query: (body) => ({
        url: "/valuation/calculate",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useCalculateValuationMutation } = valuationApi;
