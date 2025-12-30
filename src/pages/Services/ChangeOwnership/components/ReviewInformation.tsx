import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useInitiateTransferPaymentMutation } from "../../../../services/transfersApi"

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

    const PAYMENT_AMOUNT = 5000 // ₦5,000 as per API example

    if (!state || !state.requestId || !state.nextOwnerInfo) {
        navigate("/services/change-ownership/enter-cert-no")
        return null
    }

    const handleProceedToPayment = async () => {
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
                            Review Transfer Information
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please review all information before proceeding to payment
                        </p>                        {/* Success Indicator */}
                        <div className="mb-6 p-4 bg-green-50 border-2 border-green-600 rounded-lg flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <p className="text-sm font-medium text-green-800">
                                Transfer information submitted successfully!
                            </p>
                        </div>

                        {/* Information Cards */}
                        <div className="space-y-6 mb-6">
                            {/* Vehicle Information */}
                            <div className="p-6 border-2 border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">Make</p>
                                        <p className="text-gray-900 font-medium">{state.vehicleInfo.make}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Model</p>
                                        <p className="text-gray-900 font-medium">{state.vehicleInfo.model}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Year</p>
                                        <p className="text-gray-900 font-medium">{state.vehicleInfo.year}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Color</p>
                                        <p className="text-gray-900 font-medium">{state.vehicleInfo.color}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500 mb-1">Plate Number</p>
                                        <p className="text-gray-900 font-medium">{state.vehicleInfo.plate_number}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Current Owner */}
                            <div className="p-6 border-2 border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Owner</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">Name</p>
                                        <p className="text-gray-900 font-medium">{state.currentOwner.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Phone</p>
                                        <p className="text-gray-900 font-medium">{state.currentOwner.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Email</p>
                                        <p className="text-gray-900 font-medium">{state.currentOwner.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* New Owner */}
                            <div className="p-6 border-2 border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">New Owner</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">Name</p>
                                        <p className="text-gray-900 font-medium">{state.nextOwnerInfo.ownerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Address</p>
                                        <p className="text-gray-900 font-medium">{state.nextOwnerInfo.ownerAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Phone</p>
                                        <p className="text-gray-900 font-medium">{state.nextOwnerInfo.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Email</p>
                                        <p className="text-gray-900 font-medium">{state.nextOwnerInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 mb-2">
                                <strong>Payment Amount:</strong> ₦{(PAYMENT_AMOUNT / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-sm text-blue-800">
                                Click the button below to proceed to payment gateway to complete the ownership transfer.
                            </p>
                        </div>

                        {/* API Error Display */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleProceedToPayment}
                            disabled={isLoading}
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
