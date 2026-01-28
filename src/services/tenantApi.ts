import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TenantStats, TenantSettings } from "../types/tenant";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const tenantApi = createApi({
  reducerPath: "tenantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      try {
        const token = localStorage.getItem("authToken");
        if (token && token !== "undefined") {
          headers.set("Authorization", `Bearer ${token}`);
        } else if (!token) {
          console.warn("No auth token found in localStorage");
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["TenantStats", "TenantSettings"],
  endpoints: (builder) => ({
    // Get tenant dashboard stats
    getTenantStats: builder.query<TenantStats, void>({
      query: () => ({
        url: "/tenant/stats",
        method: "GET",
      }),
      providesTags: ["TenantStats"],
    }),

    // Get tenant settings
    getTenantSettings: builder.query<TenantSettings, void>({
      query: () => ({
        url: "/tenant/settings",
        method: "GET",
      }),
      providesTags: ["TenantSettings"],
    }),
  }),
});

export const {
  useGetTenantStatsQuery,
  useGetTenantSettingsQuery,
  useLazyGetTenantStatsQuery,
  useLazyGetTenantSettingsQuery,
} = tenantApi;
