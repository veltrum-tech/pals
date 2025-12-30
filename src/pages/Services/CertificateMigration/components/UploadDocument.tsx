import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Upload, FileText, X } from "lucide-react"
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

            // Navigate to next step on success
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

            {/* Form Section */}
            <section className="bg-white p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col min-h-[60vh] justify-between">
                    <div>
                        {/* Step Header */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Upload Certificate Document
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please upload your existing vehicle certificate for migration
                        </p>

                        {/* File Upload Area */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => {
                                e.preventDefault()
                                setIsDragging(true)
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            className={`border-2 border-dashed ${isDragging ? 'border-secondary bg-secondary/5' :
                                error ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg p-8 text-center transition-colors`}
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
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer"
                                    >
                                        <span className="text-secondary font-medium hover:underline">
                                            Click to upload
                                        </span>
                                        <span className="text-gray-600"> or drag and drop</span>
                                    </label>
                                    <p className="text-sm text-gray-500 mt-2">
                                        JPG, PNG or PDF (Max 5MB)
                                    </p>
                                </>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <FileText className="h-8 w-8 text-secondary" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
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
                                        className="ml-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Please ensure the document is clear and legible.
                                Accepted formats are JPG, PNG, or PDF with a maximum file size of 5MB.
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={!selectedFile || isLoading}
                            className="w-full md:max-w-md py-3 px-6 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Uploading..." : "Continue"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
