import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { migrationsApi } from "../services/migrationsApi";
import { transfersApi } from "../services/transfersApi";
import { lgaApi } from "@/services/lgaApi";
import { registrationsApi } from "@/services/registrationsApi";
import { renewalsApi } from "@/services/renewalsApi";
import { valuationApi } from "@/services/valuationApi";

export const store = configureStore({
  reducer: {
    [migrationsApi.reducerPath]: migrationsApi.reducer,
    [transfersApi.reducerPath]: transfersApi.reducer,
    [lgaApi.reducerPath]: lgaApi.reducer,
    [registrationsApi.reducerPath]: registrationsApi.reducer,
    [renewalsApi.reducerPath]: renewalsApi.reducer,
    [valuationApi.reducerPath]: valuationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(migrationsApi.middleware)
      .concat(transfersApi.middleware)
      .concat(lgaApi.middleware)
      .concat(registrationsApi.middleware)
      .concat(renewalsApi.middleware)
      .concat(valuationApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
