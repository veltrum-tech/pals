import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Upload, FileText, X, Info, CloudUpload } from "lucide-react"
import { useUploadCertificateMutation } from "../../../../services/migrationsApi"

interface LocationState {
    vin: string
    requestId: string
    vehicleInfo: any
    additionalInfo: any
}

export default function UploadDocument() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [uploadCertificate, { isLoading }] = useUploadCertificateMutation()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [error, setError] = useState("")
    const [isDragging, setIsDragging] = useState(false)

    if (!state || !state.requestId) {
        navigate("/services/certificate-migration/enter-vin")
        return null
    }

    const validateFile = (file: File) => {
        const maxSize = 5 * 1024 * 1024 // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
        const ext = file.name.split('.').pop()?.toLowerCase()
        const allowedExts = ['jpg', 'jpeg', 'png', 'pdf']

        if (file.size > maxSize) {
            return "File too large. Maximum size is 5MB"
        }

        if (!allowedTypes.includes(file.type) || !ext || !allowedExts.includes(ext)) {
            return "Unsupported file format. Only JPG, PNG or PDF allowed."
        }

        return null
    }

    const handleFileSelect = (file: File) => {
        const validationError = validateFile(file)
        if (validationError) {
            setError(validationError)
            setSelectedFile(null)
        } else {
            setError("")
            setSelectedFile(file)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedFile) {
            setError("Document is required")
            return
        }

        try {
            await uploadCertificate({
                requestId: state.requestId,
                file: selectedFile
            }).unwrap()

            navigate("/services/certificate-migration/information-summary", {
                state: {
                    ...state,
                    uploadedFile: selectedFile.name
                }
            })
        } catch (error: any) {
            console.error("Upload failed:", error)
            setError(error?.data?.message || "Failed to upload document. Please try again.")
        }
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
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">
                                Upload Ownership Certificate
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Please upload your existing proof of ownership for security review and verification.
                        </p>
                    </div>

                    {/* Card Content */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* Upload Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                    <CloudUpload className="w-5 h-5 text-[#B41662]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Document Upload</h3>
                            </div>
                            <div className="p-5">
                                {/* File Upload Area */}
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        setIsDragging(true)
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${isDragging
                                        ? 'border-green-500 bg-green-50 scale-[1.02]'
                                        : selectedFile
                                            ? 'border-green-400 bg-green-50/50'
                                            : error
                                                ? 'border-red-300 bg-red-50/30'
                                                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileInput}
                                        className="hidden"
                                    />

                                    {!selectedFile ? (
                                        <>
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Upload className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <label
                                                htmlFor="file-upload"
                                                className="cursor-pointer"
                                            >
                                                <span className="text-green-600 font-semibold hover:underline">
                                                    Click to upload
                                                </span>
                                                <span className="text-gray-600"> or drag and drop</span>
                                            </label>
                                            <p className="text-sm text-gray-500 mt-2">
                                                JPG, PNG or PDF (Max 5MB)
                                            </p>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null)
                                                    setError("")
                                                }}
                                                className="ml-4 p-2 hover:bg-red-50 rounded-full transition-colors group"
                                            >
                                                <X className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
                                )}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded">
                            <div className="p-1.5 bg-blue-100 rounded-full mt-0.5">
                                <Info className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Please ensure the document is clear and legible.
                                Accepted formats are JPG, PNG, or PDF with a maximum file size of 5MB.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={!selectedFile || isLoading}
                                className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${selectedFile && !isLoading
                                    ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                    : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Upload className="w-5 h-5" />
                                <span>{isLoading ? "Uploading..." : "Continue"}</span>
                                {!isLoading && selectedFile && (
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
                    Your document will be securely processed
                </p>
            </div>
        </main>
    )
}
