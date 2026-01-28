export interface TenantStats {
  business: {
    totalRevenue: number;
    currency: string;
  };
  operations: {
    registrations: number;
    renewals: number;
    pendingReviews: number;
  };
  inventory: {
    vehicles: number;
  };
  team: {
    totalStaff: number;
  };
}

export interface TenantSettings {
  id: string;
  name: string;
  subdomain: string;
  state: string;
  status: "ACTIVE" | "INACTIVE";
  vomsApiKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantError {
  message: string;
  error: string;
  statusCode: number;
}
