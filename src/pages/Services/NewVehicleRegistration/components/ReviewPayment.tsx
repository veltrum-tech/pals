import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Check, ClipboardList, User, Car, Cog, FileText, CreditCard, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useCreateRegistrationMutation, useInitiateRegistrationPaymentMutation, useUploadRegistrationDocumentsMutation } from "@/services/registrationsApi"
import PaymentSuccessModal from "@/components/ui/payment-success-modal"


interface LocationState {
    vin: string
    vinVerified: boolean
    vehicleInfo?: any
    ownerInfo: {
        ownerName: string
        ownerPhone: string
        ownerEmail: string
        ownerAddress: string
        ownerNin: string
        title: string
    }
    vehicleDetails: {
        vehicleMake: string
        vehicleModel: string
        vehicleYear: number
        vehicleColor: string
        engineNumber: string
        chassisNumber: string
        vehicleType: string
        plateNumber: string
    }
    uploadedDocuments: Array<{ file: File; documentType: string }>
}

const REGISTRATION_AMOUNT = 10000 // ₦10,000

export default function ReviewPayment() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [createRegistration] = useCreateRegistrationMutation()
    const [uploadDocuments] = useUploadRegistrationDocumentsMutation()
    const [initiatePayment] = useInitiateRegistrationPaymentMutation()

    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [currentStep, setCurrentStep] = useState<"review" | "processing" | "payment" | "verifying">("review")

    if (!state || !state.vin) {
        navigate("/services/new-vehicle-registration/verify-vin")
        return null
    }

    // Ensure uploadedDocuments is an array
    const uploadedDocuments = state.uploadedDocuments || []

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
        </div>
    )

    const handleProceedToPayment = async () => {
        if (!confirmed) return

        setCurrentStep("processing")
        setError("")

        try {
            toast.loading("Creating registration...")
            // Step 1: Create registration request
            const registrationResponse = await createRegistration({
                vin: state.vin,
                ownerName: state.ownerInfo.ownerName,
                ownerPhone: state.ownerInfo.ownerPhone,
                ownerEmail: state.ownerInfo.ownerEmail,
                ownerAddress: state.ownerInfo.ownerAddress,
                ownerNin: state.ownerInfo.ownerNin,
                vehicleMake: state.vehicleDetails.vehicleMake,
                vehicleModel: state.vehicleDetails.vehicleModel,
                vehicleYear: parseInt(state.vehicleDetails.vehicleYear.toString()),
                vehicleColor: state.vehicleDetails.vehicleColor,
                engineNumber: state.vehicleDetails.engineNumber,
                chassisNumber: state.vehicleDetails.chassisNumber,
                vehicleType: state.vehicleDetails.vehicleType,
            }).unwrap()

            const newRequestId = registrationResponse.requestId
            toast.success("Registration created successfully")

            // Step 2: Upload documents
            if (uploadedDocuments.length > 0) {
                toast.loading("Uploading documents...")
                await uploadDocuments({
                    requestId: newRequestId,
                    files: uploadedDocuments
                }).unwrap()
                toast.success("Documents uploaded successfully")
            }

            // Step 3: Initiate payment with callback URL
            toast.loading("Initiating payment...")
            const callbackUrl = `${window.location.origin}/payment/callback`
            const paymentResponse = await initiatePayment({
                requestId: newRequestId,
                data: { 
                    amount: REGISTRATION_AMOUNT,
                    callbackUrl 
                }
            }).unwrap()

            // Extract payment URL from response - handle both direct and nested response formats
            const paymentUrl = paymentResponse.paymentUrl ||
                paymentResponse.data?.authorization_url ||
                paymentResponse.data.authorization_url
            const reference = paymentResponse.reference ||
                paymentResponse.data?.reference

            // Redirect to payment page
            if (paymentUrl) {
                // Store payment info for callback verification
                sessionStorage.setItem("paymentRequestId", newRequestId)
                sessionStorage.setItem("paymentReference", reference)
                sessionStorage.setItem("paymentUserEmail", state.ownerInfo.ownerEmail)
                sessionStorage.setItem("paymentServiceType", "registration")

                toast.success("Redirecting to payment...")

                // Redirect to payment gateway
                window.location.href = paymentUrl
            } else {
                setError("Payment URL not received. Please try again.")
                toast.error("Payment URL not received. Please try again.")
                setCurrentStep("review")
            }
        } catch (error: any) {
            console.error("Registration processing failed:", error)
            const errorMessage =
                error?.data?.message ||
                "Failed to process registration. Please try again."
            toast.error(errorMessage)
            setError(errorMessage)
            setCurrentStep("review")
        }
    }


    return (
        <>
            <PaymentSuccessModal
                isOpen={showSuccessModal}
                userEmail={state.ownerInfo.ownerEmail}
                applicationName="New Vehicle Registration"
                redirectPath="/home"
                onClose={() => setShowSuccessModal(false)}
            />
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <button
                        onClick={() => navigate(-1)}
                        disabled={currentStep === "processing" || currentStep === "payment" || currentStep === "verifying"}
                        className="group flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    Review & Payment
                                </h1>
                            </div>
                            <p className="text-green-100 text-sm md:text-base">
                                Please review all information before confirming
                            </p>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Payment Status Display */}
                            {currentStep === "payment" && (
                                <div className="flex items-center gap-4 p-5 bg-blue-50 border border-blue-200 rounded">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-blue-700 font-medium">Payment in Progress</p>
                                        <p className="text-blue-600">Complete your payment in the popup window to continue</p>
                                    </div>
                                </div>
                            )}

                            {currentStep === "verifying" && (
                                <div className="flex items-center gap-4 p-5 bg-yellow-50 border border-yellow-200 rounded">
                                    <div className="p-3 bg-yellow-100 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-yellow-700 font-medium">Verifying Payment</p>
                                        <p className="text-yellow-600">Please wait while we verify your payment...</p>
                                    </div>
                                </div>
                            )}

                            {/* Summary Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Owner Information */}
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <User className="w-5 h-5 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Owner Information</h3>
                                    </div>
                                    <div className="px-5 py-4">
                                        <InfoRow label="Title" value={state.ownerInfo.title} />
                                        <InfoRow label="Full Name" value={state.ownerInfo.ownerName} />
                                        <InfoRow label="NIN" value={state.ownerInfo.ownerNin} />
                                        <InfoRow label="Phone" value={state.ownerInfo.ownerPhone} />
                                        <InfoRow label="Email" value={state.ownerInfo.ownerEmail} />
                                        <InfoRow label="Address" value={state.ownerInfo.ownerAddress} />
                                    </div>
                                </div>

                                {/* Vehicle Information */}
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                        <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                            <Car className="w-5 h-5 text-[#B41662]" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Vehicle Information</h3>
                                    </div>
                                    <div className="px-5 py-4">
                                        <InfoRow label="VIN" value={state.vin} />
                                        <InfoRow label="Make" value={state.vehicleDetails.vehicleMake} />
                                        <InfoRow label="Model" value={state.vehicleDetails.vehicleModel} />
                                        <InfoRow label="Year" value={state.vehicleDetails.vehicleYear.toString()} />
                                        <InfoRow label="Color" value={state.vehicleDetails.vehicleColor} />
                                        <InfoRow label="Type" value={state.vehicleDetails.vehicleType} />
                                    </div>
                                </div>

                                {/* Technical Details */}
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Cog className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Technical Details</h3>
                                    </div>
                                    <div className="px-5 py-4">
                                        <InfoRow label="Engine Number" value={state.vehicleDetails.engineNumber} />
                                        <InfoRow label="Chassis Number" value={state.vehicleDetails.chassisNumber} />
                                        <InfoRow label="Plate Number" value={state.vehicleDetails.plateNumber || "To be assigned"} />
                                    </div>
                                </div>

                                {/* Documents Summary */}
                                <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Uploaded Documents</h3>
                                    </div>
                                    <div className="px-5 py-4">
                                        {uploadedDocuments.length > 0 ? (
                                            <div className="space-y-3">
                                                {uploadedDocuments.map((item: any, index) => (
                                                    <div key={index} className="flex items-center gap-3 py-2">
                                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {item?.file?.name || `Document ${index + 1}`}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 py-2">No documents uploaded</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="flex items-center gap-4 p-5 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CreditCard className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-green-700 font-medium">Registration Fee</p>
                                    <p className="text-2xl font-bold text-green-800">
                                        ₦{(REGISTRATION_AMOUNT).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-green-600">
                                        Covers registration processing<br />and certification
                                    </p>
                                </div>
                            </div>

                            {/* Error Display */}
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
                                        disabled={currentStep === "processing" || currentStep === "payment" || currentStep === "verifying"}
                                        className={`shrink-0 w-7 h-7 mt-0.5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-50 ${confirmed
                                            ? 'bg-[#B41662] border-[#B41662] shadow-lg shadow-[#B41662]/30'
                                            : 'bg-white border-[#B41662] hover:bg-[#B41662]/10'
                                            }`}
                                    >
                                        {confirmed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                    </button>
                                    <label
                                        onClick={() => currentStep === "review" && setConfirmed(!confirmed)}
                                        className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                                    >
                                        I confirm that all information provided is accurate and complete. I understand that any false information may result in rejection of this application.
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={currentStep === "processing" || currentStep === "payment" || currentStep === "verifying"}
                                    className="flex-1 sm:flex-none px-8 py-4 border-2 border-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleProceedToPayment}
                                    disabled={!confirmed || currentStep === "processing" || currentStep === "payment" || currentStep === "verifying"}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${confirmed && currentStep === "review"
                                        ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>
                                        {currentStep === "processing" ? "Processing..." :
                                            currentStep === "payment" ? "Payment in Progress..." :
                                                currentStep === "verifying" ? "Verifying..." : "Proceed to Payment"}
                                    </span>
                                    {currentStep === "review" && confirmed && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                   
                </div>
            </main>
        </>
    )
}

