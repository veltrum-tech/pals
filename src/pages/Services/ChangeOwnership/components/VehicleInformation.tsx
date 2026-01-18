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
        <div
            onClick={onChange}
            className={`flex items-center gap-4 p-4 rounded border-2 cursor-pointer transition-all duration-300 ${checked
                ? 'border-[#B41662] bg-[#B41662]/5 shadow-md'
                : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30'
                }`}
        >
            <div
                className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${checked
                    ? 'border-[#B41662] bg-[#B41662] scale-110'
                    : 'border-gray-300 bg-white'
                    }`}
            >
                {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${checked ? 'text-gray-900' : 'text-gray-600'}`}>
                    {label}
                </span>
            </div>
        </div>
    )

    const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
        <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-gray-900 font-semibold">{value}</p>
        </div>
    )

    return (
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
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Vehicle & Owner Information
                        </h1>
                        <p className="text-white text-sm md:text-base">
                            Please review the details below before proceeding with verification details below
                        </p>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8 space-y-6">
                        {/* Certificate Badge */}
                        <div className="inline-flex items-center px-5 py-2.5">
                            <div>
                                <span className="text-lg font-semibold text-gray-800 uppercase tracking-wide">Certificate No.</span>
                                <p className="text-green-800 font-bold text-lg -mt-0.5">{state.certificateNo}</p>
                            </div>
                        </div>

                        {/* Vehicle Details Card */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">

                                <h3 className="text-lg font-semibold text-gray-800">Vehicle Details</h3>
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

                        {/* Owner Details Card */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">

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

                        {/* Confirmation Checkbox */}
                        <CustomCheckbox
                            checked={confirmed}
                            onChange={() => setConfirmed(!confirmed)}
                            label="For security, current owner will confirm transfer request by OTP"
                        />

                        {/* Error Display */}
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

                        {/* OTP Section */}
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Send OTP to verify ownership
                            </p>
                            <button
                                type="button"
                                onClick={() => handleSendOTP('email')}
                                disabled={!confirmed || isLoading}
                                className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${confirmed && !isLoading
                                    ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                    : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Mail className="w-5 h-5" />
                                <span>{isLoading ? "Sending OTP..." : "Send OTP via Email"}</span>
                                {!isLoading && confirmed && (
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
                    By proceeding, you confirm that all information displayed is accurate
                </p>
            </div>
        </main>
    )
}
