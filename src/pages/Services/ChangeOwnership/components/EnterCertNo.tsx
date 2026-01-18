import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, FileText, Info, Search } from "lucide-react"
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
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Enter Certificate Number
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Please provide a VOMS certificate number for the vehicle ownership transfer
                        </p>
                    </div>

                    {/* Card Content */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* Certificate Number Input Card */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                    <FileText className="w-5 h-5 text-[#B41662]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Certificate Details</h3>
                            </div>
                            <div className="p-5">
                                <label htmlFor="certificateNo" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    Certificate Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="certificateNo"
                                    type="text"
                                    value={certificateNo}
                                    onChange={(e) => {
                                        setCertificateNo(e.target.value)
                                        if (errors.certificateNo || errors.api) setErrors({})
                                    }}
                                    className={`w-full border-2 ${errors.certificateNo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                    placeholder="Enter VOMS certificate number"
                                />
                                {errors.certificateNo && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.certificateNo}</p>
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
                            <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                                <Info className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> The certificate number can be found on your VOMS proof of ownership certificate.
                                Migrate to the VOMS Digital certificate if you still have the legacy documents.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading || !certificateNo.trim()}
                                className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${certificateNo.trim() && !isLoading
                                        ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Search className="w-5 h-5" />
                                <span>{isLoading ? "Verifying..." : "Continue"}</span>
                                {!isLoading && certificateNo.trim() && (
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
                    Enter your certificate number to begin the ownership transfer process
                </p>
            </div>
        </main>
    )
}
