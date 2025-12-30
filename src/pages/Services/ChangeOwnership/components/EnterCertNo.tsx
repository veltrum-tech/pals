import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useVerifyCertificateMutation } from "../../../../services/transfersApi"

export default function EnterCertNo() {
    const navigate = useNavigate()
    const [certificateNo, setCertificateNo] = useState("")
    const [errors, setErrors] = useState<{ certificateNo?: string; api?: string }>({})

    const [verifyCertificate, { isLoading }] = useVerifyCertificateMutation()

    const validate = () => {
        if (!certificateNo.trim()) {
            setErrors({ certificateNo: "Certificate number is required" })
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        try {
            const response = await verifyCertificate({
                certificate_number: certificateNo.trim()
            }).unwrap()

            // Navigate with response data
            navigate("/services/change-ownership/vehicle-information", {
                state: {
                    certificateNo: certificateNo.trim(),
                    requestId: response.requestId,
                    currentOwner: response.vehicleInfo.currentOwner,
                    vehicleInfo: response.vehicleInfo.vehicleInfo
                }
            })
        } catch (error: any) {
            console.error("Certificate verification failed:", error)
            setErrors({
                api: error?.data?.message || "Failed to verify certificate. Please check and try again."
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
                            Enter Certificate Number
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please enter the certificate number for the vehicle ownership transfer
                        </p>                        {/* Certificate Number Input */}
                        <div className="mb-6">
                            <label htmlFor="certificateNo" className="block text-sm font-medium text-gray-700 mb-2">
                                Certificate Number
                            </label>
                            <input
                                id="certificateNo"
                                type="text"
                                value={certificateNo}
                                onChange={(e) => {
                                    setCertificateNo(e.target.value)
                                    if (errors.certificateNo || errors.api) setErrors({})
                                }}
                                className={`w-full border ${errors.certificateNo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
                                placeholder="Enter certificate number"
                            />
                            {errors.certificateNo && (
                                <p className="mt-2 text-sm text-red-600">{errors.certificateNo}</p>
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
                                <strong>Note:</strong> The certificate number can be found on your vehicle registration certificate.
                                Please ensure you enter the correct number to proceed with the ownership transfer.
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
