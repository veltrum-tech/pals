import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LGA } from "@/types/lga";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL2 ||
  "https://voms-backend-1.onrender.com/api/v1";
const TENANT_ID = import.meta.env.VITE_TENANT_ID || "jigawa";

export const lgaApi = createApi({
  reducerPath: "lgaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("X-Tenant-ID", TENANT_ID);
      headers.set("Accept", "application/json");
      // Don't set Content-Type here - let it be set per request
      return headers;
    },
  }),
  tagTypes: ["LGA"],
  endpoints: (builder) => ({
    getState: builder.query<string[], void>({
      query: () => ({
        url: "/lgas/states",
        method: "GET",
      }),
    }),
    getLGAs: builder.query<LGA[], string>({
      query: (stateId) => ({
        url: stateId ? `/lgas?state=${stateId}` : "/lgas",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetLGAsQuery, useGetStateQuery } = lgaApi;
