// New Vehicle Registration API Request Types
export interface CreateRegistrationRequest {
  vin: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAddress: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  ownerNin: string;
  engineNumber: string;
  chassisNumber: string;
  vehicleType: string;
}

export interface VerifyVinForRegistrationRequest {
  vin: string;
}

export interface UploadRegistrationDocumentsRequest {
  // Form data with files
  files?: File[];
}

export interface InitiateRegistrationPaymentRequest {
  amount: number;
  callbackUrl?: string;
}

export interface VerifyRegistrationPaymentRequest {
  reference: string;
}

export interface SubmitRegistrationReviewRequest {
  action: "approve" | "reject";
  rejectionReason?: string;
}

// New Vehicle Registration API Response Types
export interface CreateRegistrationResponse {
  success: boolean;
  requestId: string;
  message?: string;
}

export interface VerifyVinForRegistrationResponse {
  success: boolean;
  vin: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    color: string;
  };
}

export interface UploadRegistrationDocumentsResponse {
  success: boolean;
  message: string;
  files?: string[];
}

// Paystack payment data structure
export interface PaystackPaymentData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface InitiateRegistrationPaymentResponse {
  status: boolean;
  message: string;
  data: PaystackPaymentData;
  // Legacy fields for backward compatibility
  success?: boolean;
  requestId?: string;
  paymentUrl?: string;
  reference?: string;
  amount?: number;
}

export interface VerifyRegistrationPaymentResponse {
  success: boolean;
  message: string;
  status: "pending" | "success" | "failed";
}

export interface SubmitRegistrationReviewResponse {
  success: boolean;
  message: string;
  status: "approved" | "rejected";
}

// Combined Registration Request State
export interface RegistrationFormData extends CreateRegistrationRequest {
  documents?: File[];
  amount?: number;
}

// Error Response Type
export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}
