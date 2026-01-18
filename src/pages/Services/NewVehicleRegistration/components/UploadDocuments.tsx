import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Upload, X, ChevronDown, CheckCircle2, FileText, Info, AlertCircle, CloudUpload } from "lucide-react"
import { toast } from "sonner"

interface LocationState {
    vin: string
    vinVerified: boolean
    vehicleInfo?: any
    ownerInfo: any
    vehicleDetails: any
}

interface DocumentType {
    id: string
    name: string
    description: string
    uploaded: boolean
    file: File | null
}

const REQUIRED_DOCUMENTS: DocumentType[] = [
    {
        id: "ownership",
        name: "Proof of Ownership",
        description: "Original ownership document",
        uploaded: false,
        file: null
    },
    {
        id: "inspection",
        name: "Vehicle Inspection Report",
        description: "Recent vehicle inspection",
        uploaded: false,
        file: null
    },
    {
        id: "identification",
        name: "Valid Identification",
        description: "National ID, Driver's License, or Passport",
        uploaded: false,
        file: null
    }
]

export default function UploadDocuments() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [documents, setDocuments] = useState<DocumentType[]>(REQUIRED_DOCUMENTS)
    const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
    const [error, setError] = useState("")
    const [dragOverDoc, setDragOverDoc] = useState<string | null>(null)

    if (!state || !state.vin) {
        navigate("/services/motor-vehicle-registration/verify-vin")
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

    const handleFileSelect = (file: File, docId?: string) => {
        const validationError = validateFile(file)
        if (validationError) {
            setError(validationError)
            toast.error(validationError)
            return
        }

        if (docId) {
            // Assign to specific document
            setDocuments(documents.map(doc =>
                doc.id === docId
                    ? { ...doc, file, uploaded: true }
                    : doc
            ))
            setError("")
            toast.success(`${file.name} uploaded successfully`)
            setExpandedDoc(null)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, docId?: string) => {
        e.preventDefault()
        setDragOverDoc(null)
        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFileSelect(files[0], docId)
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, docId?: string) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            handleFileSelect(files[0], docId)
        }
    }

    const removeDocument = (docId: string) => {
        setDocuments(documents.map(doc =>
            doc.id === docId
                ? { ...doc, file: null, uploaded: false }
                : doc
        ))
    }

    const allDocumentsUploaded = documents.every(doc => doc.uploaded)

    // Map document IDs to API document types
    const getDocumentTypeForAPI = (docId: string): string => {
        const typeMap: Record<string, string> = {
            ownership: "proof_of_ownership",
            inspection: "vehicle_inspection_report",
            identification: "valid_identification"
        }
        return typeMap[docId] || "proof_of_ownership"
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!allDocumentsUploaded) {
            setError("All required documents must be uploaded")
            toast.error("All required documents must be uploaded")
            return
        }

        toast.success("All documents uploaded! Proceeding to review...")

        // Create files array with document types
        const uploadedFiles = documents
            .filter(doc => doc.file)
            .map(doc => ({
                file: doc.file!,
                documentType: getDocumentTypeForAPI(doc.id)
            }))

        navigate("/services/new-vehicle-registration/review-payment", {
            state: {
                ...state,
                uploadedDocuments: uploadedFiles
            }
        })
    }

    const uploadedCount = documents.filter(d => d.uploaded).length
    const progressPercent = (uploadedCount / documents.length) * 100

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
                                <CloudUpload className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Upload Documents
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Upload all required documents for vehicle registration
                        </p>
                    </div>

                    {/* Card Content */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* VIN Display */}
                        <div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Info className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-medium">Vehicle Identification Number</p>
                                <p className="text-sm font-bold text-blue-800 font-mono tracking-wider">{state.vin}</p>
                            </div>
                        </div>

                        {/* Upload Progress Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Required Documents</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold ${uploadedCount === documents.length ? 'text-green-600' : 'text-[#B41662]'}`}>
                                        {uploadedCount}
                                    </span>
                                    <span className="text-gray-400">/</span>
                                    <span className="text-gray-600">{documents.length}</span>
                                </div>
                            </div>
                            <div className="px-5 py-4">
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Upload Progress</span>
                                        <span className={`text-sm font-semibold ${progressPercent === 100 ? 'text-green-600' : 'text-gray-600'}`}>
                                            {Math.round(progressPercent)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${progressPercent === 100
                                                    ? 'bg-linear-to-r from-green-500 to-green-600'
                                                    : 'bg-linear-to-r from-[#B41662] to-pink-500'
                                                }`}
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-start gap-3 p-4 mb-4 bg-red-50 border border-red-200 rounded">
                                        <div className="p-1.5 bg-red-100 rounded-full mt-0.5">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                        </div>
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                )}

                                {/* Documents List */}
                                <div className="space-y-3">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Document Header */}
                                            <button
                                                type="button"
                                                onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                                                className={`w-full flex items-center justify-between p-4 transition-all ${doc.uploaded
                                                        ? 'bg-green-50 hover:bg-green-100'
                                                        : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 text-left flex-1">
                                                    {doc.uploaded ? (
                                                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0 shadow-sm">
                                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                                                            <Upload className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className={`font-semibold ${doc.uploaded ? 'text-green-800' : 'text-gray-800'}`}>
                                                            {doc.name}
                                                        </p>
                                                        {doc.uploaded && doc.file && (
                                                            <p className="text-xs text-green-600 mt-0.5 font-medium">
                                                                ✓ {doc.file.name}
                                                            </p>
                                                        )}
                                                        {!doc.uploaded && (
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                Click to upload
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronDown
                                                    size={20}
                                                    className={`shrink-0 transition-transform ${doc.uploaded ? 'text-green-600' : 'text-gray-400'
                                                        } ${expandedDoc === doc.id ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            {/* Document Upload Section */}
                                            {expandedDoc === doc.id && (
                                                <div className="p-4 bg-white border-t border-gray-200">
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        {doc.description}
                                                    </p>

                                                    {!doc.uploaded ? (
                                                        <div
                                                            onDragOver={(e) => {
                                                                e.preventDefault()
                                                                setDragOverDoc(doc.id)
                                                            }}
                                                            onDragLeave={() => setDragOverDoc(null)}
                                                            onDrop={(e) => handleDrop(e, doc.id)}
                                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${dragOverDoc === doc.id
                                                                    ? 'border-green-500 bg-green-50 scale-[1.02]'
                                                                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <Upload className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-700 font-medium mb-2">
                                                                Drag and drop your file here
                                                            </p>
                                                            <p className="text-gray-400 text-sm mb-3">or</p>
                                                            <label className="inline-block">
                                                                <input
                                                                    type="file"
                                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                                    onChange={(e) => handleFileInput(e, doc.id)}
                                                                    className="hidden"
                                                                />
                                                                <span className="px-6 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold cursor-pointer hover:from-green-700 hover:to-green-800 transition-all inline-block text-sm shadow-md hover:shadow-lg">
                                                                    Choose File
                                                                </span>
                                                            </label>
                                                            <p className="text-gray-400 text-xs mt-3">
                                                                JPG, PNG, or PDF (Max 5MB)
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                                        <FileText className="w-5 h-5 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-green-800">
                                                                            {doc.file?.name}
                                                                        </p>
                                                                        <p className="text-xs text-green-600">
                                                                            {(doc.file!.size / 1024 / 1024).toFixed(2)} MB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeDocument(doc.id)}
                                                                    className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                                                                >
                                                                    <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 sm:flex-none px-8 py-4 border-2 border-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!allDocumentsUploaded}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${allDocumentsUploaded
                                        ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <span>Review & Pay</span>
                                {allDocumentsUploaded && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Your documents are securely processed
                </p>
            </div>
        </main>
    )
}
