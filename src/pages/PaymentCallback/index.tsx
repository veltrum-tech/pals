import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckCircle, XCircle, Loader2, Home, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useVerifyRegistrationPaymentMutation } from "@/services/registrationsApi"
import { useVerifyRenewalPaymentMutation } from "@/services/renewalsApi"
import { useVerifyPaymentMutation } from "@/services/migrationsApi"
import { useVerifyTransferPaymentMutation } from "@/services/transfersApi"

type PaymentStatus = "verifying" | "success" | "failed"
type PaymentType = "registration" | "migration" | "transfer" | "renewal" | null

export default function PaymentCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [status, setStatus] = useState<PaymentStatus>("verifying")
    const [errorMessage, setErrorMessage] = useState("")
    const [paymentType, setPaymentType] = useState<PaymentType>(null)
    const [userEmail, setUserEmail] = useState("")

    // Verification mutations for different payment types
    const [verifyRegistrationPayment] = useVerifyRegistrationPaymentMutation()
    const [verifyMigrationPayment] = useVerifyPaymentMutation()
    const [verifyTransferPayment] = useVerifyTransferPaymentMutation()
    const [verifyRenewalPayment] = useVerifyRenewalPaymentMutation()

    useEffect(() => {
        const verifyPayment = async () => {
            // Get reference from URL (Paystack adds this as query param)
            const reference = searchParams.get("reference") || searchParams.get("trxref")

            // Get stored data from sessionStorage
            const storedRequestId = sessionStorage.getItem("registrationRequestId") ||
                sessionStorage.getItem("migrationRequestId") ||
                sessionStorage.getItem("transferRequestId") ||
                sessionStorage.getItem("renewalRequestId")

            const storedReference = sessionStorage.getItem("registrationReference") ||
                sessionStorage.getItem("migrationReference") ||
                sessionStorage.getItem("transferReference") ||
                sessionStorage.getItem("renewalReference")

            const storedEmail = sessionStorage.getItem("userEmail") || ""
            const pendingPaymentType = sessionStorage.getItem("pendingPayment") as PaymentType

            setUserEmail(storedEmail)
            setPaymentType(pendingPaymentType)

            // Use URL reference if available, otherwise use stored reference
            const paymentReference = reference || storedReference

            if (!paymentReference || !storedRequestId) {
                setStatus("failed")
                setErrorMessage("Payment information not found. Please contact support.")
                return
            }

            try {
                // Call the appropriate verification endpoint based on payment type
                switch (pendingPaymentType) {
                    case "registration":
                        await verifyRegistrationPayment({
                            requestId: storedRequestId,
                            data: { reference: paymentReference }
                        }).unwrap()
                        break
                    case "migration":
                        await verifyMigrationPayment({
                            requestId: storedRequestId,
                            reference: paymentReference
                        }).unwrap()
                        break
                    case "transfer":
                        await verifyTransferPayment({
                            requestId: storedRequestId,
                            reference: paymentReference
                        }).unwrap()
                        break
                    case "renewal":
                        await verifyRenewalPayment({
                            requestId: storedRequestId,
                            data: { reference: paymentReference }
                        }).unwrap()
                        break
                    default:
                        // Default to registration if type not found
                        await verifyRegistrationPayment({
                            requestId: storedRequestId,
                            data: { reference: paymentReference }
                        }).unwrap()
                }

                // If we get a response without errors, consider it successful
                setStatus("success")
                toast.success("Payment verified successfully!")

                // Clean up stored data
                sessionStorage.removeItem("registrationRequestId")
                sessionStorage.removeItem("registrationReference")
                sessionStorage.removeItem("migrationRequestId")
                sessionStorage.removeItem("migrationReference")
                sessionStorage.removeItem("transferRequestId")
                sessionStorage.removeItem("transferReference")
                sessionStorage.removeItem("renewalRequestId")
                sessionStorage.removeItem("renewalReference")
                sessionStorage.removeItem("userEmail")
                sessionStorage.removeItem("pendingPayment")
            } catch (error: any) {
                console.error("Payment verification failed:", error)
                setStatus("failed")
                setErrorMessage(
                    error?.data?.message ||
                    "Payment verification failed. Please contact support if payment was deducted."
                )
            }
        }

        verifyPayment()
    }, [searchParams, verifyRegistrationPayment, verifyMigrationPayment, verifyTransferPayment, verifyRenewalPayment])

    const getApplicationName = () => {
        switch (paymentType) {
            case "registration":
                return "New Vehicle Registration"
            case "migration":
                return "Certificate Migration"
            case "transfer":
                return "Change of Ownership"
            case "renewal":
                return "License Renewal"
            default:
                return "Application"
        }
    }

    const handleRetry = () => {
        setStatus("verifying")
        setErrorMessage("")
        window.location.reload()
    }

    return (
        <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-8 text-center ${status === "verifying" ? "bg-linear-to-r from-blue-600 to-blue-700" :
                    status === "success" ? "bg-linear-to-r from-green-600 to-green-700" :
                        "bg-linear-to-r from-red-600 to-red-700"
                    }`}>
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        {status === "verifying" && (
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                        )}
                        {status === "success" && (
                            <CheckCircle className="w-10 h-10 text-white" />
                        )}
                        {status === "failed" && (
                            <XCircle className="w-10 h-10 text-white" />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {status === "verifying" && "Verifying Payment..."}
                        {status === "success" && "Payment Successful!"}
                        {status === "failed" && "Payment Failed"}
                    </h1>
                    <p className="text-white/80">
                        {status === "verifying" && "Please wait while we confirm your payment"}
                        {status === "success" && getApplicationName()}
                        {status === "failed" && "We couldn't verify your payment"}
                    </p>
                </div>

                {/* Content */}
                <div className="px-6 py-8">
                    {status === "verifying" && (
                        <div className="text-center">
                            <p className="text-gray-600">
                                This may take a few moments. Please don't close this page.
                            </p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <p className="text-green-800 text-sm">
                                    Your payment has been confirmed and your application is now being processed.
                                    {userEmail && (
                                        <span className="block mt-2">
                                            A confirmation email has been sent to <strong>{userEmail}</strong>
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="text-center text-gray-600 text-sm">
                                <p>You will receive updates on your application status via email and SMS.</p>
                            </div>
                        </div>
                    )}

                    {status === "failed" && (
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-800 text-sm">{errorMessage}</p>
                            </div>
                            <p className="text-center text-gray-600 text-sm">
                                If money was deducted from your account, please contact our support team with your payment reference.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 pb-8 space-y-3">
                    {status === "success" && (
                        <button
                            onClick={() => navigate("/home")}
                            className="w-full py-3 px-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg shadow-green-600/30 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Go to Homepage
                        </button>
                    )}

                    {status === "failed" && (
                        <>
                            <button
                                onClick={handleRetry}
                                className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Retry Verification
                            </button>
                            <button
                                onClick={() => navigate("/home")}
                                className="w-full py-3 px-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Go to Homepage
                            </button>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}
