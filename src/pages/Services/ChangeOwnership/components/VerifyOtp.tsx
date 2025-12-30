import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
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

            // Navigate to next step on success
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
        <main className="container mx-auto min-h-screen">
            {/* Header */}
            <div className="text-secondary py-6 px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft size={20} />
                    <span className="text-base">Back</span>
                </button>
            </div>

            {/* Form Section */}
            <section className="bg-white p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col min-h-[60vh] justify-between">
                    <div>
                        {/* Step Header */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Verify OTP
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Enter the 6-digit OTP sent to {state.currentOwner.name}'s {state.otpMethod}
                        </p>                        {/* Current Owner Info */}
                        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500 mb-2">Current Owner</p>
                            <p className="text-base font-medium text-gray-900">{state.currentOwner.name}</p>
                            <p className="text-sm text-gray-600">
                                {state.otpMethod === 'email' ? state.currentOwner.email : state.currentOwner.phone}
                            </p>
                        </div>

                        {/* OTP Input */}
                        <div className="mb-6 flex justify-center">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={otp}
                                onChange={handleOtpChange}
                                maxLength={6}
                                className={`text-center text-2xl tracking-widest font-mono w-full max-w-md border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
                                placeholder="000000"
                            />
                        </div>

                        {errors.otp && (
                            <p className="text-center mb-6 text-sm text-red-600">{errors.otp}</p>
                        )}

                        {/* API Error Display */}
                        {errors.api && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{errors.api}</p>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Didn't receive the OTP?</strong> Go back and try sending it again.
                                Make sure you check your spam folder if sent via email.
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full md:max-w-md py-3 px-6 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
