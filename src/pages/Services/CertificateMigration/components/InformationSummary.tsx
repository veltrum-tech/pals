import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Check, ClipboardList, Car, User, CreditCard, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useInitiatePaymentMutation, useVerifyPaymentMutation } from "../../../../services/migrationsApi"
import PaymentSuccessModal from "@/components/ui/payment-success-modal"

interface LocationState {
    vin: string
    requestId: string
    vehicleInfo: any
    additionalInfo: any
    uploadedFile: string
}

export default function InformationSummary() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [initiatePayment, { isLoading }] = useInitiatePaymentMutation()
    const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation()

    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const PAYMENT_AMOUNT = 10000 // ₦10,000 as per API default

    if (!state || !state.requestId) {
        navigate("/services/certificate-migration/enter-vin")
        return null
    }

    const handleProceedToPayment = async () => {
        if (!confirmed) return

        try {
            toast.loading("Initiating payment...")
            const response = await initiatePayment({
                requestId: state.requestId,
                data: { amount: PAYMENT_AMOUNT }
            }).unwrap()

            if (response.paymentUrl) {
                sessionStorage.setItem("migrationRequestId", state.requestId)
                sessionStorage.setItem("migrationReference", response.reference)
                sessionStorage.setItem("userEmail", state.additionalInfo?.email || "")

                toast.dismiss()
                toast.success("Opening payment window...")

                // Open payment in a mini window
                const paymentWindow = window.open(
                    response.paymentUrl,
                    'paymentWindow',
                    'width=500,height=600,scrollbars=yes,resizable=yes,status=yes'
                )

                if (!paymentWindow) {
                    toast.error("Popup blocked. Please allow popups and try again.")
                    return
                }

                // Monitor payment window
                const checkPaymentWindow = setInterval(async () => {
                    if (paymentWindow.closed) {
                        clearInterval(checkPaymentWindow)
                        toast.loading("Verifying payment...")

                        // Verify payment after window closes
                        try {
                            const verifyResponse = await verifyPayment({
                                requestId: state.requestId,
                                reference: response.reference
                            }).unwrap()

                            toast.dismiss()

                            if (verifyResponse.status === 'success') {
                                setShowSuccessModal(true)
                                toast.success("Payment successful!")
                            } else {
                                toast.error("Payment verification failed. Please contact support if money was deducted.")
                                setError("Payment verification failed. Please contact support if money was deducted.")
                            }
                        } catch (verifyError: any) {
                            console.error("Payment verification failed:", verifyError)
                            const errorMessage = verifyError?.data?.message || "Payment verification failed. Please contact support."
                            toast.error(errorMessage)
                            setError(errorMessage)
                        }
                    }
                }, 1000) // Check every second

                // Clean up interval after 10 minutes to prevent memory leaks
                setTimeout(() => {
                    clearInterval(checkPaymentWindow)
                }, 600000)

            } else {
                toast.dismiss()
                setError("Payment URL not received. Please try again.")
                toast.error("Payment URL not received. Please try again.")
            }
        } catch (error: any) {
            console.error("Payment initiation failed:", error)
            toast.dismiss()
            const errorMessage = error?.data?.message || "Failed to initiate payment. Please try again."
            toast.error(errorMessage)
            setError(errorMessage)
        }
    }

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
        </div>
    )

    return (
        <>
            <PaymentSuccessModal
                isOpen={showSuccessModal}
                userEmail={state.additionalInfo?.email || ""}
                applicationName="Certificate Migration"
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
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Review Information
                                </h1>
                            </div>
                            <p className="text-green-100 text-sm md:text-base">
                                Please review all information before proceeding to payment
                            </p>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Summary Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Vehicle Information */}
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Car className="w-5 h-5 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Vehicle Information</h3>
                                    </div>
                                    <div className="px-5 py-4">
                                        <InfoRow label="VIN" value={state.vin} />
                                        <InfoRow label="Make" value={state.vehicleInfo.make} />
                                        <InfoRow label="Model" value={state.vehicleInfo.model} />
                                        <InfoRow label="Year" value={state.vehicleInfo.year} />
                                        {state.vehicleInfo.type && (
                                            <InfoRow label="Type" value={state.vehicleInfo.type} />
                                        )}
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                        <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                            <User className="w-5 h-5 text-[#B41662]" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Additional Details</h3>
                                    </div>
                                    <div className="px-5 py-4">
                                        <InfoRow label="Certificate Number" value={state.additionalInfo.certificateNo} />
                                        <InfoRow label="Plate Number" value={state.additionalInfo.plateNo} />
                                        <InfoRow label="Owner Name" value={state.additionalInfo.ownerName} />
                                        <InfoRow label="Phone" value={state.additionalInfo.phone} />
                                        <InfoRow label="Email" value={state.additionalInfo.email} />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="flex items-center gap-4 p-5 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CreditCard className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-green-700 font-medium">Payment Amount</p>
                                    <p className="text-2xl font-bold text-green-800">
                                        ₦{(PAYMENT_AMOUNT / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>

                            {/* API Error Display */}
                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded">
                                    <div className="p-1.5 bg-red-100 rounded-full mt-0.5">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                    </div>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Confirmation Checkbox */}
                            <div className="border-2 border-[#B41662] rounded-lg p-6 bg-[#B41662]/5">
                                <div className="flex items-start gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setConfirmed(!confirmed)}
                                        className={`shrink-0 w-7 h-7 mt-0.5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${confirmed
                                            ? 'bg-[#B41662] border-[#B41662] shadow-lg shadow-[#B41662]/30'
                                            : 'bg-white border-[#B41662] hover:bg-[#B41662]/10'
                                            }`}
                                    >
                                        {confirmed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                    </button>
                                    <label
                                        onClick={() => setConfirmed(!confirmed)}
                                        className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                                    >
                                        I confirm that the information above is correct and I want to proceed with the payment
                                    </label>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleProceedToPayment}
                                    disabled={!confirmed || isLoading || isVerifying}
                                    className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${confirmed && !isLoading && !isVerifying
                                        ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>
                                        {isLoading ? "Processing..." :
                                            isVerifying ? "Verifying..." :
                                                "Proceed to Payment"}
                                    </span>
                                    {!isLoading && !isVerifying && confirmed && (
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
                        Your payment will be securely processed
                    </p>
                </div>
            </main>
        </>
    )
}
