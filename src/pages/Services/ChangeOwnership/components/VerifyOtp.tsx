import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, ShieldCheck, Mail, Phone, Info } from "lucide-react"
import { useVerifyOtpMutation } from "../../../../services/transfersApi"

interface LocationState {
    certificateNo: string
    requestId: string
    currentOwner: any
    vehicleInfo: any
    otpMethod: 'email' | 'sms'
}

export default function VerifyOtp() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [verifyOtp, { isLoading }] = useVerifyOtpMutation()

    const [otp, setOtp] = useState("")
    const [errors, setErrors] = useState<{ otp?: string; api?: string }>({})

    if (!state || !state.requestId) {
        navigate("/services/change-ownership/enter-cert-no")
        return null
    }

    const validate = () => {
        if (!otp) {
            setErrors({ otp: "OTP is required" })
            return false
        }
        if (otp.length !== 6) {
            setErrors({ otp: "OTP must be exactly 6 digits" })
            return false
        }
        if (!/^\d+$/.test(otp)) {
            setErrors({ otp: "OTP must contain only numbers" })
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        try {
            await verifyOtp({
                requestId: state.requestId,
                data: { otp }
            }).unwrap()

            navigate("/services/change-ownership/next-owner-info", {
                state: {
                    ...state,
                    otpVerified: true
                }
            })
        } catch (error: any) {
            console.error("OTP verification failed:", error)
            setErrors({
                api: error?.data?.message || "Invalid OTP. Please try again."
            })
        }
    }

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
        setOtp(value)
        if (errors.otp || errors.api) setErrors({})
    }

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
                        <div className="flex items-center gap-3 mb-2">
                            
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Verify OTP
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Enter the 6-digit code sent to {state.currentOwner.name}'s {state.otpMethod}
                        </p>
                    </div>

                    {/* Card Content */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* Current Owner Card */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                
                                <h3 className="text-lg font-semibold text-gray-800">Current Owner</h3>
                            </div>
                            <div className="p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100 flex-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                                        <p className="text-gray-900 font-semibold">{state.currentOwner.name}</p>
                                    </div>
                                    <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100 flex-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                            {state.otpMethod === 'email' ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                                            OTP Sent To
                                        </p>
                                        <p className="text-gray-900 font-semibold">
                                            {state.otpMethod === 'email' ? state.currentOwner.email : state.currentOwner.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* OTP Input Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                
                                <h3 className="text-lg font-semibold text-gray-800">Enter Verification Code</h3>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-center">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        maxLength={6}
                                        className={`text-center text-3xl tracking-[0.5em] font-mono w-full max-w-xs border-2 ${errors.otp ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'
                                            } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        placeholder="••••••"
                                    />
                                </div>
                                {errors.otp && (
                                    <p className="text-center mt-3 text-sm text-red-600 font-medium">{errors.otp}</p>
                                )}
                            </div>
                        </div>

                        {/* API Error Display */}
                        {errors.api && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded">
                                <div className="p-1 bg-red-100 rounded-full mt-0.5">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-sm text-red-700">{errors.api}</p>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded">
                            <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                                <Info className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-700">
                                <strong>Didn't receive the OTP?</strong> Go back and try sending it again.
                                Make sure you check your spam folder if sent via email.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${otp.length === 6 && !isLoading
                                        ? 'bg-green-600 hover:bg-green-400   hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <ShieldCheck className="w-5 h-5" />
                                <span>{isLoading ? "Verifying..." : "Verify OTP"}</span>
                                {!isLoading && otp.length === 6 && (
                                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    This verification ensures secure transfer of vehicle ownership
                </p>
            </div>
        </main>
    )
}
