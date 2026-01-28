import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  LoginRequest,
  LoginResponse,
  MagicLinkRequest,
  MagicLinkResponse,
  VerifyMagicLinkRequest,
  VerifyMagicLinkResponse,
  GetUserProfileResponse,
} from "../types/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = createApi({
  reducerPath: "authApi",
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
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // Login with email and password
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Request magic link
    requestMagicLink: builder.mutation<MagicLinkResponse, MagicLinkRequest>({
      query: (body) => ({
        url: "/auth/magic-link",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Verify magic link
    verifyMagicLink: builder.query<
      VerifyMagicLinkResponse,
      VerifyMagicLinkRequest
    >({
      query: ({ email, token }) => ({
        url: `/auth/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
        method: "GET",
      }),
    }),

    // Get current user profile
    getCurrentUserProfile: builder.query<GetUserProfileResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRequestMagicLinkMutation,
  useVerifyMagicLinkQuery,
  useLazyVerifyMagicLinkQuery,
  useGetCurrentUserProfileQuery,
  useLazyGetCurrentUserProfileQuery,
} = authApi;
