// Transfer API Request Types
export interface VerifyCertificateRequest {
  certificate_number: string;
}

export interface SendOtpRequest {
  method: "sms" | "email";
}

export interface VerifyOtpRequest {
  otp: string;
}

export interface SubmitTransferRequest {
  new_owner_name: string;
  new_owner_phone: string;
  new_owner_email: string;
  new_owner_address: string;
  new_plate_number?: string;
}

export interface InitiateTransferPaymentRequest {
  amount: number;
}

// Transfer API Response Types
export interface VerifyCertificateResponse {
  success: boolean;
  requestId: string;
  vehicleInfo: {
    success: boolean;
    requestId: string;
    currentOwner: {
      name: string;
      phone: string;
      email: string;
    };
    vehicleInfo: {
      make: string;
      model: string;
      year: number;
      color: string;
      plate_number: string;
    };
  };
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface SubmitTransferResponse {
  success: boolean;
  message: string;
}

export interface InitiateTransferPaymentResponse {
  success: boolean;
  requestId: string;
  paymentUrl: string;
  reference: string;
  amount: number;
}
