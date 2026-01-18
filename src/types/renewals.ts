// Vehicle Renewal API Request Types
export interface InitiateRenewalRequest {
  vin: string;
  ownerPhone: string;
}

export interface VerifyRenewalPaymentRequest {
  reference: string;
}

// Vehicle Renewal API Response Types
export interface InitiateRenewalResponse {
  success: boolean;
  requestId: string;
  paymentUrl: string;
  reference: string;
  message?: string;
  vehicleInfo?: {
    vin: string;
    make: string;
    model: string;
    year: number;
    color: string;
    ownerName: string;
    plateNumber: string;
    currentExpiryDate: string;
    newExpiryDate: string;
  };
}

export interface VerifyRenewalPaymentResponse {
  success: boolean;
  message: string;
  status: "pending" | "success" | "failed";
  renewalDetails?: {
    requestId: string;
    vin: string;
    plateNumber: string;
    newExpiryDate: string;
    approvalDate: string;
  };
}
