// API Request Types
export interface VerifyVinRequest {
  vin: string;
}

export interface SubmitInfoRequest {
  state: string;
  lga_id: string;
  certificate_number: string;
  issue_date: string;
  plate_number: string;
  purpose: string;
  owner_name: string;
  owner_address: string;
  engine_number: string;
  title: string;
  telephone: string;
  email: string;
  vehicle_color: string;
}

export interface InitiatePaymentRequest {
  amount: number;
}

// API Response Types
export interface VerifyVinResponse {
  success: boolean;
  requestId: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    color: string;
    vin: string;
  };
}

export interface SubmitInfoResponse {
  success: boolean;
  message: string;
}

export interface UploadCertificateResponse {
  success: boolean;
  message: string;
  fileUrl?: string;
}

export interface InitiatePaymentResponse {
  success: boolean;
  requestId: string;
  paymentUrl: string;
  reference: string;
  amount: number;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  status: "pending" | "success" | "failed";
}

// Error Response Type
export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}
