import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, CheckCircle, Car, User, UserPlus, CreditCard, Info } from "lucide-react"
import { toast } from "sonner"
import { useInitiateTransferPaymentMutation } from "../../../../services/transfersApi"
import PaymentSuccessModal from "@/components/ui/payment-success-modal"

interface LocationState {
    certificateNo: string
    requestId: string
    currentOwner: any
    vehicleInfo: any
    nextOwnerInfo: any
}

export default function ReviewInformation() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [initiatePayment, { isLoading }] = useInitiateTransferPaymentMutation()
    const [error, setError] = useState("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const PAYMENT_AMOUNT = 1000 // ₦5,000 as per API example

    if (!state || !state.requestId || !state.nextOwnerInfo) {
        navigate("/services/change-ownership/enter-cert-no")
        return null
    }

    const handleProceedToPayment = async () => {
        try {
            setError("") // Clear any previous errors
            toast.loading("Initiating payment...")

            const response = await initiatePayment({
                requestId: state.requestId,
                data: { amount: PAYMENT_AMOUNT }
            }).unwrap()

            // Handle both possible response formats
            const paymentUrl = response.paymentUrl || (response as any).data?.authorization_url
            const reference = response.reference || (response as any).data?.reference

            if (paymentUrl && reference) {
                // Store payment info in sessionStorage for callback
                sessionStorage.setItem("paymentServiceType", "transfer")
                sessionStorage.setItem("paymentRequestId", state.requestId)
                sessionStorage.setItem("paymentUserEmail", state.nextOwnerInfo?.email || "")
                sessionStorage.setItem("paymentReference", reference)
                
                toast.success("Redirecting to payment gateway...")
                
                // Redirect to payment gateway (same window to avoid popup blockers)
                window.location.href = paymentUrl
            } else {
                setError("Payment URL not received. Please try again.")
                toast.error("Payment URL not received. Please try again.")
                toast.error("Payment URL not received. Please try again.")
            }
        } catch (error: any) {
            console.error("Payment initiation failed:", error)
            const errorMessage = error?.data?.message || "Failed to initiate payment. Please try again."
            toast.error(errorMessage)
            setError(errorMessage)
        }
    }

    const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
        <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-gray-900 font-semibold">{value}</p>
        </div>
    )

    return (
        <>
            <PaymentSuccessModal
                isOpen={showSuccessModal}
                userEmail={state.nextOwnerInfo?.email || ""}
                applicationName="Ownership Transfer"
                redirectPath="/home"
                onClose={() => setShowSuccessModal(false)}
            />
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-8"
                    >
                        <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-green-50 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Main Card */}
                    <div className="bg-white rounded shadow-xl shadow-gray-200/50 overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-green-600 px-6 py-8 md:px-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Review Transfer Information
                                </h1>
                            </div>
                            <p className="text-green-100 text-sm md:text-base">
                                Please review all information before proceeding to payment
                            </p>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Success Indicator */}
                            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-500 rounded">
                                <div className="p-1.5 bg-green-100 rounded-full">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-green-800">
                                    Transfer information submitted successfully!
                                </p>
                            </div>

                            {/* Vehicle Information Card */}
                            <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Car className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Vehicle Information</h3>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        <InfoItem label="Make" value={state.vehicleInfo.make} />
                                        <InfoItem label="Model" value={state.vehicleInfo.model} />
                                        <InfoItem label="Year" value={state.vehicleInfo.year} />
                                        <InfoItem label="Color" value={state.vehicleInfo.color} />
                                        <InfoItem label="Plate Number" value={state.vehicleInfo.plate_number} />
                                    </div>
                                </div>
                            </div>

                            {/* Current Owner Card */}
                            <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Current Owner</h3>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <InfoItem label="Full Name" value={state.currentOwner.name} />
                                        <InfoItem label="Phone Number" value={state.currentOwner.phone} />
                                        <InfoItem label="Email Address" value={state.currentOwner.email} />
                                    </div>
                                </div>
                            </div>

                            {/* New Owner Card */}
                            <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                    <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                        <UserPlus className="w-5 h-5 text-[#B41662]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">New Owner</h3>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <InfoItem label="Full Name" value={state.nextOwnerInfo.ownerName} />
                                        <InfoItem label="Address" value={state.nextOwnerInfo.ownerAddress} />
                                        <InfoItem label="Phone Number" value={state.nextOwnerInfo.phone} />
                                        <InfoItem label="Email Address" value={state.nextOwnerInfo.email} />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded">
                                <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                                    <Info className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-800 mb-1">
                                        <strong>Payment Amount:</strong> ₦{(PAYMENT_AMOUNT).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        Click the button below to proceed to payment gateway to complete the ownership transfer.
                                    </p>
                                </div>
                            </div>

                            {/* API Error Display */}
                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded">
                                    <div className="p-1 bg-red-100 rounded-full mt-0.5">
                                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Payment Button */}
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <button
                                    onClick={handleProceedToPayment}
                                    disabled={isLoading}
                                    className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${!isLoading
                                        ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>{isLoading ? "Processing..." : "Proceed to Payment"}</span>
                                    {!isLoading && (
                                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Your payment is secured and encrypted
                    </p>
                </div>
            </main>
        </>
    )
}
