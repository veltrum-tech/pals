import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useVerifyVinMutation } from "../../../../services/migrationsApi"

export default function EnterVin() {
    const navigate = useNavigate()
    const [vin, setVin] = useState("")
    const [errors, setErrors] = useState<{ vin?: string; api?: string }>({})

    const [verifyVin, { isLoading }] = useVerifyVinMutation()

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

            // Navigate with response data
            navigate("/services/certificate-migration/vin-information", {
                state: {
                    requestId: response.requestId,
                    vehicleInfo: {
                        make: response.vehicleInfo.make,
                        model: response.vehicleInfo.model,
                        year: response.vehicleInfo.year.toString(),
                        color: response.vehicleInfo.color,
                        vin: response.vehicleInfo.vin
                    }
                }
            })
        } catch (error: any) {
            console.error("VIN verification failed:", error)
            setErrors({
                api: error?.data?.message || "Failed to verify VIN. Please check and try again."
            })
        }
    }

    return (
        <main className="container mx-auto min-h-screen">
            {/* Header */}
            <div className="text-secondary py-6 px-4">
                <button
                    onClick={() => navigate("/services/motor-vehicle-registration")}
                    className=" flex items-center gap-2 hover:opacity-80 transition-opacity"
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
                            Enter Vehicle Identification Number
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please enter the VIN of the vehicle you want to migrate
                        </p>

                        {/* VIN Input */}
                        <div className="mb-6">
                            <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Identification Number (VIN)
                            </label>
                            <input
                                id="vin"
                                type="text"
                                value={vin}
                                onChange={(e) => {
                                    setVin(e.target.value.toUpperCase())
                                    if (errors.vin || errors.api) setErrors({})
                                }}
                                maxLength={17}
                                className={`w-full border ${errors.vin ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent uppercase`}
                                placeholder="Enter 17-character VIN"
                            />
                            {errors.vin && (
                                <p className="mt-2 text-sm text-red-600">{errors.vin}</p>
                            )}
                        </div>

                        {/* API Error Display */}
                        {errors.api && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{errors.api}</p>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> The VIN is a unique 17-character code used to identify your vehicle.
                                You can find it on your vehicle registration documents or on the driver's side dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:max-w-md py-3 px-6 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Verifying..." : "Continue"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
