import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import { useInitiatePaymentMutation } from "../../../../services/migrationsApi"

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

    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")

    const PAYMENT_AMOUNT = 10000 // ₦10,000 as per API default

    if (!state || !state.requestId) {
        navigate("/services/certificate-migration/enter-vin")
        return null
    }

    const handleProceedToPayment = async () => {
        if (!confirmed) return

        try {
            const response = await initiatePayment({
                requestId: state.requestId,
                data: { amount: PAYMENT_AMOUNT }
            }).unwrap()

            // Redirect to payment gateway
            if (response.paymentUrl) {
                window.location.href = response.paymentUrl
            } else {
                setError("Payment URL not received. Please try again.")
            }
        } catch (error: any) {
            console.error("Payment initiation failed:", error)
            setError(error?.data?.message || "Failed to initiate payment. Please try again.")
        }
    }

    return (
        <main className="container mx-auto min-h-screen">
            {/* Header */}
            <div className="text-secondary py-6 px-4">
                <button
                    onClick={() => navigate(-1)}
                    className=" flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft size={20} />
                    <span className="text-base">Back</span>
                </button>
            </div>

            {/* Content Section */}
            <section className="bg-white p-6 md:p-8">
                <div className="flex flex-col min-h-[60vh] justify-between">
                    <div>
                        {/* Step Header */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Review Information
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please review all information before proceeding to payment
                        </p>

                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* VIN Information */}
                            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">VIN</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.vin}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Make</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.vehicleInfo.make}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Model</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.vehicleInfo.model}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Year</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.vehicleInfo.year}</p>
                                    </div>
                                    {state.vehicleInfo.type && (
                                        <div>
                                            <p className="text-xs text-gray-500">Type</p>
                                            <p className="text-sm text-gray-900 font-medium">{state.vehicleInfo.type}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Certificate Number</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.additionalInfo.certificateNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Plate Number</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.additionalInfo.plateNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Owner Name</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.additionalInfo.ownerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.additionalInfo.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm text-gray-900 font-medium">{state.additionalInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Payment Amount:</strong> ₦{(PAYMENT_AMOUNT / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* API Error Display */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Confirmation Checkbox */}
                        <div className="border-2 border-[#B41662] rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <button
                                    type="button"
                                    onClick={() => setConfirmed(!confirmed)}
                                    className="shrink-0 w-6 h-6 mt-0.5 rounded border-2 border-[#B41662] flex items-center justify-center cursor-pointer transition-colors"
                                    style={{ backgroundColor: confirmed ? "#B41662" : "white" }}
                                >
                                    {confirmed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                </button>
                                <label onClick={() => setConfirmed(!confirmed)} className="text-sm text-gray-900 cursor-pointer leading-relaxed">
                                    I confirm that the information above is correct and I want to proceed with the payment
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Payment Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleProceedToPayment}
                            disabled={!confirmed || isLoading}
                            className="w-full md:max-w-md py-3 px-6 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : "Proceed to Payment"}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}
