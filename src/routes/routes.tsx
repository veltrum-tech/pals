import { createBrowserRouter, Navigate } from "react-router-dom";
import Homepage from "../pages/Home";
import Root from "../components/layout/root";
import Services from "@/pages/Services";
import MotorVehicleRegistration from "@/pages/Services/MotorVehicleRegistration";
import NewVehicleRegistration from "@/pages/Services/NewVehicleRegistration";
import VerifyVin from "@/pages/Services/NewVehicleRegistration/components/VerifyVin";
import OwnerInformation from "@/pages/Services/NewVehicleRegistration/components/OwnerInformation";
import VehicleDetails from "@/pages/Services/NewVehicleRegistration/components/VehicleDetails";
import UploadDocuments from "@/pages/Services/NewVehicleRegistration/components/UploadDocuments";
import ReviewPayment from "@/pages/Services/NewVehicleRegistration/components/ReviewPayment";
import CertificateMigration from "@/pages/Services/CertificateMigration";
import EnterVin from "@/pages/Services/CertificateMigration/components/EnterVin";
import VinInformation from "@/pages/Services/CertificateMigration/components/VinInformation";
import AdditionalInformation from "@/pages/Services/CertificateMigration/components/AdditionalInformation";
import UploadDocument from "@/pages/Services/CertificateMigration/components/UploadDocument";
import InformationSummary from "@/pages/Services/CertificateMigration/components/InformationSummary";
import ChangeOwnership from "@/pages/Services/ChangeOwnership";
import EnterCertNo from "@/pages/Services/ChangeOwnership/components/EnterCertNo";
import VehicleInformation from "@/pages/Services/ChangeOwnership/components/VehicleInformation";
import VerifyOtp from "@/pages/Services/ChangeOwnership/components/VerifyOtp";
import NextOwnerInformation from "@/pages/Services/ChangeOwnership/components/NextOwnerInformation";
import ReviewInformation from "@/pages/Services/ChangeOwnership/components/ReviewInformation";
import RenewalLicense from "@/pages/Services/RenewalLicense";
import EnterVehicleInfo from "@/pages/Services/RenewalLicense/components/EnterVehicleInfo";
import PaymentConfirmation from "@/pages/Services/RenewalLicense/components/PaymentConfirmation";
import VehicleValuation from "@/pages/Services/VehicleValuation";
import ValuationEnterVin from "@/pages/Services/VehicleValuation/components/EnterVin";
import ValuationResult from "@/pages/Services/VehicleValuation/components/ValuationResult";
import PaymentCallback from "@/pages/Payment/PaymentCallback";
import PaymentRedirect from "@/pages/Payment/PaymentRedirect";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";
import { LoginForm } from "@/components/auth/LoginForm";
import { MagicLinkVerification } from "@/components/auth/MagicLinkVerification";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { AdminLayout } from "@/components/layout/AdminLayout";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to={"/home"} />,
    },
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "home",
                element: <Homepage />,
            },
            {
                path: "services",
                element: <Services />,
            },
            {
                path: "payment/callback",
                element: <PaymentCallback />,
            },
            // Backend payment redirect handlers
            {
                path: "registrations/:requestId/verify",
                element: <PaymentRedirect />,
            },
            {
                path: "registrations/:requestId/verify-payment",
                element: <PaymentRedirect />,
            },
            {
                path: "transfers/:requestId/verify-payment",
                element: <PaymentRedirect />,
            },
            {
                path: "renewals/:requestId/verify-payment",
                element: <PaymentRedirect />,
            },
            {
                path: "migrations/:requestId/verify-payment",
                element: <PaymentRedirect />,
            },
            {
                path: "services/motor-vehicle-registration",
                element: <MotorVehicleRegistration />,
            },
            {
                path: "services/new-vehicle-registration",
                element: <NewVehicleRegistration />,
                children: [
                    {
                        path: 'verify-vin',
                        element: <VerifyVin />,
                    },
                    {
                        path: "owner-information",
                        element: <OwnerInformation />,
                    },
                    {
                        path: "vehicle-details",
                        element: <VehicleDetails />,
                    },
                    {
                        path: "upload-documents",
                        element: <UploadDocuments />,
                    },
                    {
                        path: "review",
                        element: <ReviewPayment />,
                    },
                ],
            },
            {
                path: "services/certificate-migration",
                element: <CertificateMigration />,
                children: [
                    {
                        path: "enter-vin",
                        element: <EnterVin />,
                    },
                    {
                        path: "vin-information",
                        element: <VinInformation />,
                    },
                    {
                        path: "additional-information",
                        element: <AdditionalInformation />,
                    },
                    {
                        path: "upload-document",
                        element: <UploadDocument />,
                    },
                    {
                        path: "information-summary",
                        element: <InformationSummary />,
                    },
                ],
            },
            {
                path: "services/change-ownership",
                element: <ChangeOwnership />,
                children: [
                    {
                        path: "enter-cert-no",
                        element: <EnterCertNo />,
                    },
                    {
                        path: "vehicle-information",
                        element: <VehicleInformation />,
                    },
                    {
                        path: "verify-otp",
                        element: <VerifyOtp />,
                    },
                    {
                        path: "next-owner-info",
                        element: <NextOwnerInformation />,
                    },
                    {
                        path: "review-information",
                        element: <ReviewInformation />,
                    },
                ],
            },
            {
                path: "services/renewal-license",
                element: <RenewalLicense />,
                children: [
                    {
                        index: true,
                        element: <EnterVehicleInfo />,
                    },
                    {
                        path: "payment",
                        element: <PaymentConfirmation />,
                    },
                ],
            },
            {
                path: "services/vehicle-valuation",
                element: <VehicleValuation />,
                children: [
                    {
                        index: true,
                        element: <ValuationEnterVin />,
                    },
                    {
                        path: "result",
                        element: <ValuationResult />,
                    },
                ],
            },
            {
                path: "services/*",
                element: <ComingSoon />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
           
        ]
    },
     {
                path: "admin",
                children: [
                    {
                        index: true,
                        element: <Navigate to={"/admin/login"} />,
                    },
                    {
                        path: "login",
                        element: <LoginForm />
                    },
                    {
                        path: "magic-link",
                        element: <MagicLinkVerification />
                    },
                    {
                        path: "dashboard",
                        element: (
                            <ProtectedRoute>
                               <AdminLayout />
                            </ProtectedRoute>
                        ),
                        children: [
                            {
                                index: true,
                                element: <TenantDashboard />
                            }
                        ]
                    }
                ]
            }
])

export default routes;