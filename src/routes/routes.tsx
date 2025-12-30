import { createBrowserRouter, Navigate } from "react-router-dom";
import Homepage from "../pages/Home";
import Root from "../components/layout/root";
import Services from "@/pages/Services";
import MotorVehicleRegistration from "@/pages/Services/MotorVehicleRegistration";
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
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";

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
                path: "services/motor-vehicle-registration",
                element: <MotorVehicleRegistration />,
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
                path: "services/*",
                element: <ComingSoon />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ]
    }
])

export default routes;