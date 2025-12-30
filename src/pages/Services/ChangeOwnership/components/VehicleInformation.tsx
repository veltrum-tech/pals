import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Check, Mail } from "lucide-react"
import { useSendOtpMutation } from "../../../../services/transfersApi"

interface LocationState {
    certificateNo: string
    requestId: string
    currentOwner: {
        name: string
        phone: string
        email: string
    }
    vehicleInfo: {
        make: string
        model: string
        year: number
        color: string
        plate_number: string
    }
}

export default function VehicleInformation() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [sendOtp, { isLoading }] = useSendOtpMutation()

    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")

    if (!state || !state.requestId) {
        navigate("/services/change-ownership/enter-cert-no")
        return null
    }

    const handleSendOTP = async (method: 'email' | 'sms') => {
        if (!confirmed) return

        try {
            await sendOtp({
                requestId: state.requestId,
                data: { method }
            }).unwrap()

            // Navigate to OTP verification on success
            navigate("/services/change-ownership/verify-otp", {
                state: {
                    ...state,
                    otpMethod: method
                }
            })
        } catch (error: any) {
            console.error("Send OTP failed:", error)
            setError(error?.data?.message || "Failed to send OTP. Please try again.")
        }
    }

    const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
        <div className="flex items-start gap-3">
            <button
                type="button"
                onClick={onChange}
                className="shrink-0 w-6 h-6 mt-0.5 rounded border-2 border-[#B41662] flex items-center justify-center cursor-pointer transition-colors"
                style={{ backgroundColor: checked ? "#B41662" : "white" }}
            >
                {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </button>
            <label onClick={onChange} className="text-sm text-gray-900 cursor-pointer leading-relaxed">
                {label}
            </label>
        </div>
    )

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
                            Vehicle & Owner Information
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please verify the vehicle and current owner information
                        </p>

                        {/* Certificate Number */}
                        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Certificate Number</p>
                            <p className="text-lg font-semibold text-gray-900">{state.certificateNo}</p>
                        </div>

                        {/* Vehicle Information */}
                        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Make - </span>
                                    <span className="text-gray-900 font-medium">{state.vehicleInfo.make}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Model - </span>
                                    <span className="text-gray-900 font-medium">{state.vehicleInfo.model}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Year - </span>
                                    <span className="text-gray-900 font-medium">{state.vehicleInfo.year}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Color - </span>
                                    <span className="text-gray-900 font-medium">{state.vehicleInfo.color}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Plate No - </span>
                                    <span className="text-gray-900 font-medium">{state.vehicleInfo.plate_number}</span>
                                </div>
                            </div>
                        </div>

                        {/* Current Owner Information */}
                        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Owner</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-500">Name - </span>
                                    <span className="text-gray-900 font-medium">{state.currentOwner.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Phone - </span>
                                    <span className="text-gray-900 font-medium">{state.currentOwner.phone}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Email - </span>
                                    <span className="text-gray-900 font-medium">{state.currentOwner.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Checkbox */}
                        <div className="mb-6 border-2 border-[#B41662] rounded-lg p-6">
                            <CustomCheckbox
                                checked={confirmed}
                                onChange={() => setConfirmed(!confirmed)}
                                label="This is the correct vehicle and certificate to be processed"
                            />
                        </div>

                        {/* API Error Display */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* OTP Buttons */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-3">Send OTP to verify ownership:</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleSendOTP('email')}
                                    disabled={!confirmed || isLoading}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>{isLoading ? "Sending..." : "Send OTP via Email"}</span>
                                </button>
                                {/* <button
                                    type="button"
                                    onClick={() => handleSendOTP('sms')}
                                    disabled={!confirmed || isLoading}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    <span>{isLoading ? "Sending..." : "Send OTP via SMS"}</span>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
