export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
  };
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface VerifyMagicLinkRequest {
  email: string;
  token: string;
}

export interface VerifyMagicLinkResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
  };
}

export interface GetUserProfileResponse {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface AuthError {
  message: string;
  error: string;
  statusCode: number;
}
