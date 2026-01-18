import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Car, Hash, Info, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useVerifyVinForRegistrationMutation } from "@/services/registrationsApi"

export default function VerifyVin() {
    const navigate = useNavigate()
    const [vin, setVin] = useState("")
    const [errors, setErrors] = useState<{ vin?: string; api?: string }>({})

    const [verifyVin, { isLoading }] = useVerifyVinForRegistrationMutation()

    const validateVin = () => {
        const newErrors: { vin?: string } = {}

        if (!vin.trim()) {
            newErrors.vin = "VIN is required"
        } else if (vin.trim().length !== 17) {
            newErrors.vin = "VIN must be exactly 17 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateVin()) return

        try {
            const response = await verifyVin({ vin: vin.trim() }).unwrap()
            toast.success("VIN verified successfully!")
            navigate("/services/new-vehicle-registration/owner-information", {
                state: {
                    vin: vin.trim(),
                    vinVerified: true,
                    vehicleInfo: response.vehicleInfo
                }
            })
        } catch (error: any) {
            console.error("VIN verification failed:", error)
            const errorMessage = error?.data?.message || "Failed to verify VIN. Please check and try again."
            toast.error(errorMessage)
            setErrors({
                api: errorMessage
            })
        }
    }

    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <button
                    onClick={() => navigate("/services/motor-vehicle-registration")}
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
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Enter Vehicle Identification Number
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Please enter the VIN of the vehicle you want to register
                        </p>
                    </div>

                    {/* Card Content */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* VIN Input Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                    <Hash className="w-5 h-5 text-[#B41662]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">VIN Details</h3>
                            </div>
                            <div className="p-5">
                                <label htmlFor="vin" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Car className="w-4 h-4 text-gray-400" />
                                    Vehicle Identification Number (VIN)
                                </label>
                                <div className="relative">
                                    <input
                                        id="vin"
                                        type="text"
                                        value={vin}
                                        onChange={(e) => {
                                            setVin(e.target.value.toUpperCase())
                                            if (errors.vin || errors.api) setErrors({})
                                        }}
                                        maxLength={17}
                                        className={`w-full border-2 ${errors.vin
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                            } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 uppercase text-base font-mono tracking-wider transition-all`}
                                        placeholder="Enter 17-character VIN"
                                        disabled={isLoading}
                                    />
                                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium ${vin.length === 17 ? 'text-green-600' : 'text-gray-400'
                                        }`}>
                                        {vin.length}/17
                                    </span>
                                </div>
                                {errors.vin && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.vin}</p>
                                )}
                            </div>
                        </div>

                        {/* API Error Display */}
                        {errors.api && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded">
                                <div className="p-1.5 bg-red-100 rounded-full mt-0.5">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                </div>
                                <p className="text-sm text-red-700">{errors.api}</p>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded">
                            <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                                <Info className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-700">
                                <strong>VIN Format:</strong> A 17-character unique identifier found on your vehicle's registration or door frame.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 sm:flex-none px-8 py-4 border-2 border-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !vin.trim()}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${vin.trim() && !isLoading
                                        ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Car className="w-5 h-5" />
                                <span>{isLoading ? "Verifying..." : "Verify VIN"}</span>
                                {!isLoading && vin.trim() && (
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
                    Your information is securely processed
                </p>
            </div>
        </main>
    )
}
