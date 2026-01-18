import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useVerifyRegistrationPaymentMutation } from "@/services/registrationsApi";
import { useVerifyRenewalPaymentMutation } from "@/services/renewalsApi";
import { useVerifyTransferPaymentMutation } from "@/services/transfersApi";
import { useVerifyPaymentMutation as useVerifyMigrationPaymentMutation } from "@/services/migrationsApi";
import PaymentSuccessModal from "@/components/ui/payment-success-modal";

type PaymentStatus = "verifying" | "success" | "failed" | "error";

export default function PaymentCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<PaymentStatus>("verifying");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Get params from URL (Paystack sends reference and trxref)
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    const serviceType = sessionStorage.getItem("paymentServiceType") || "registration";
    const requestId = sessionStorage.getItem("paymentRequestId") || "";
    const userEmail = sessionStorage.getItem("paymentUserEmail") || "";

    // Payment verification mutations for different services
    const [verifyRegistrationPayment] = useVerifyRegistrationPaymentMutation();
    const [verifyRenewalPayment] = useVerifyRenewalPaymentMutation();
    const [verifyTransferPayment] = useVerifyTransferPaymentMutation();
    const [verifyMigrationPayment] = useVerifyMigrationPaymentMutation();

    useEffect(() => {
        const verifyPayment = async () => {
            if (!reference) {
                setStatus("error");
                setErrorMessage("Payment reference not found. Please contact support.");
                return;
            }

            if (!requestId) {
                setStatus("error");
                setErrorMessage("Session expired. Please start the process again.");
                return;
            }

            try {
                let result;

                switch (serviceType) {
                    case "registration":
                        result = await verifyRegistrationPayment({
                            requestId,
                            data: { reference }
                        }).unwrap();
                        break;
                    case "renewal":
                        result = await verifyRenewalPayment({
                            requestId,
                            data: { reference }
                        }).unwrap();
                        break;
                    case "transfer":
                        result = await verifyTransferPayment({
                            requestId,
                            reference
                        }).unwrap();
                        break;
                    case "migration":
                        result = await verifyMigrationPayment({
                            requestId,
                            reference
                        }).unwrap();
                        break;
                    default:
                        result = await verifyRegistrationPayment({
                            requestId,
                            data: { reference }
                        }).unwrap();
                }

                // Check for success using 'success' property (most APIs) or 'status' property
                const isSuccess = result.success === true || (result as any).status === "success";
                
                if (isSuccess) {
                    setStatus("success");
                    setShowSuccessModal(true);
                    // Clear session storage
                    sessionStorage.removeItem("paymentServiceType");
                    sessionStorage.removeItem("paymentRequestId");
                    sessionStorage.removeItem("paymentUserEmail");
                } else {
                    setStatus("failed");
                    setErrorMessage("Payment verification failed. Please try again or contact support.");
                }
            } catch (error: any) {
                console.error("Payment verification error:", error);
                setStatus("failed");
                setErrorMessage(error?.data?.message || "Unable to verify payment. Please contact support.");
            }
        };

        verifyPayment();
    }, [reference, requestId, serviceType]);

    const getServiceName = () => {
        switch (serviceType) {
            case "registration":
                return "Vehicle Registration";
            case "renewal":
                return "License Renewal";
            case "transfer":
                return "Change of Ownership";
            case "migration":
                return "Certificate Migration";
            default:
                return "Payment";
        }
    };

    const getRedirectPath = () => {
        switch (serviceType) {
            case "registration":
                return "/services";
            case "renewal":
                return "/services";
            case "transfer":
                return "/services";
            case "migration":
                return "/services";
            default:
                return "/services";
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        navigate(getRedirectPath());
    };

    const handleRetry = () => {
        navigate("/services");
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-6 md:py-12">
            <div className="container mx-auto px-3 md:px-4 max-w-lg">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className={`px-6 py-8 ${
                        status === "success" 
                            ? "bg-linear-to-r from-green-600 to-green-700" 
                            : status === "failed" || status === "error"
                            ? "bg-linear-to-r from-red-500 to-red-600"
                            : "bg-linear-to-r from-green-600 to-green-700"
                    }`}>
                        <div className="flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                {status === "verifying" && (
                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                )}
                                {status === "success" && (
                                    <CheckCircle className="w-10 h-10 text-white" />
                                )}
                                {(status === "failed" || status === "error") && (
                                    <XCircle className="w-10 h-10 text-white" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 text-center">
                        {status === "verifying" && (
                            <>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verifying Payment
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Please wait while we confirm your payment...
                                </p>
                                <div className="flex justify-center">
                                    <div className="w-16 h-1 bg-green-600 rounded-full animate-pulse"></div>
                                </div>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <h1 className="text-2xl font-bold text-green-600 mb-2">
                                    Payment Successful!
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Your payment has been verified successfully.
                                </p>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                                    <p className="text-sm text-green-700">
                                        <strong>{getServiceName()}</strong> request has been submitted.
                                        You will receive a confirmation email shortly.
                                    </p>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="w-full py-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                >
                                    Continue to Services
                                </button>
                            </>
                        )}

                        {(status === "failed" || status === "error") && (
                            <>
                                <h1 className="text-2xl font-bold text-red-600 mb-2">
                                    {status === "error" ? "Something Went Wrong" : "Payment Failed"}
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    {errorMessage}
                                </p>
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700 text-left">
                                            If money was deducted from your account, please wait a few minutes and try verifying again.
                                            If the issue persists, contact support with reference: <strong className="font-mono">{reference}</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full py-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back to Services
                                    </button>
                                </div>
                            </>
                        )}

                        {reference && (
                            <p className="mt-6 text-xs text-gray-400">
                                Reference: {reference}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <PaymentSuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseModal}
                applicationName={getServiceName()}
                userEmail={userEmail}
                redirectPath={getRedirectPath()}
            />
        </div>
    );
}
