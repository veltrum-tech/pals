/**
 * New Vehicle Registration API Service
 *
 * This module re-exports all registration API endpoints from the main registrationsApi
 * for use within the NewVehicleRegistration flow.
 *
 * Endpoints:
 * - verifyVinForRegistration: GET /registrations/verify-vin
 * - createRegistration: POST /registrations
 * - uploadRegistrationDocuments: POST /registrations/{requestId}/documents
 * - initiateRegistrationPayment: POST /registrations/{requestId}/payment
 * - verifyRegistrationPayment: POST /registrations/{requestId}/verify-payment
 * - submitRegistrationReview: POST /registrations/{requestId}/review
 */

export {
  useVerifyVinForRegistrationMutation,
  useCreateRegistrationMutation,
  useUploadRegistrationDocumentsMutation,
  useInitiateRegistrationPaymentMutation,
  useVerifyRegistrationPaymentMutation,
  useSubmitRegistrationReviewMutation,
} from "@/services/registrationsApi";

export type {
  CreateRegistrationRequest,
  CreateRegistrationResponse,
  VerifyVinForRegistrationRequest,
  VerifyVinForRegistrationResponse,
  UploadRegistrationDocumentsResponse,
  InitiateRegistrationPaymentRequest,
  InitiateRegistrationPaymentResponse,
  VerifyRegistrationPaymentRequest,
  VerifyRegistrationPaymentResponse,
  SubmitRegistrationReviewRequest,
  SubmitRegistrationReviewResponse,
  RegistrationFormData,
} from "@/types/registrations";
