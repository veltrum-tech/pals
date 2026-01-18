import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, FileText, MapPin, Car, User, Phone, Mail, Calendar, Hash } from "lucide-react"
import { useSubmitInfoMutation } from "../../../../services/migrationsApi"
import { useGetLGAsQuery, useGetStateQuery } from "../../../../services/lgaApi"

interface LocationState {
    vin: string
    requestId: string
    vehicleInfo: {
        make: string
        model: string
        year: string
        color?: string
        type?: string
    }
}

export default function AdditionalInformation() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [submitInfo, { isLoading }] = useSubmitInfoMutation()
    const { data: statesData, isLoading: statesLoading } = useGetStateQuery()
    const [selectedState, setSelectedState] = useState("")
    const { data: lgasData, isLoading: lgasLoading } = useGetLGAsQuery(selectedState, {
        skip: !selectedState
    })

    const [formData, setFormData] = useState({
        state: "",
        lga: "",
        certificateNo: "",
        issuedDate: "",
        plateNo: "",
        purpose: "",
        ownerName: "",
        ownerAddress: "",
        make: state?.vehicleInfo?.make || "",
        model: state?.vehicleInfo?.model || "",
        engineNo: "",
        chassisNo: "",
        title: "",
        phone: "",
        email: "",
        vehicleColor: state?.vehicleInfo?.color || ""
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!state || !state.requestId) {
        navigate("/services/certificate-migration/enter-vin")
        return null
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.state.trim()) newErrors.state = "State is required"
        if (!formData.lga.trim()) newErrors.lga = "LGA is required"
        if (!formData.certificateNo.trim()) newErrors.certificateNo = "Certificate number is required"
        if (!formData.issuedDate) newErrors.issuedDate = "Issued date is required"
        if (!formData.plateNo.trim()) newErrors.plateNo = "Plate number is required"
        if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required"
        if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required"
        if (!formData.ownerAddress.trim()) newErrors.ownerAddress = "Owner address is required"
        if (!formData.make.trim()) newErrors.make = "Make is required"
        if (!formData.model.trim()) newErrors.model = "Model is required"
        if (!formData.engineNo.trim()) newErrors.engineNo = "Engine number is required"
        if (!formData.chassisNo.trim()) newErrors.chassisNo = "Chassis number is required"
        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required"
        } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be between 10 and 15 digits"
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        try {
            await submitInfo({
                requestId: state.requestId,
                data: {
                    state: formData.state,
                    lga_id: formData.lga,
                    certificate_number: formData.certificateNo,
                    issue_date: formData.issuedDate,
                    plate_number: formData.plateNo,
                    purpose: formData.purpose,
                    owner_name: formData.ownerName,
                    owner_address: formData.ownerAddress,
                    engine_number: formData.engineNo,
                    title: formData.title,
                    telephone: formData.phone,
                    email: formData.email,
                    vehicle_color: formData.vehicleColor
                }
            }).unwrap()

            navigate("/services/certificate-migration/upload-document", {
                state: {
                    ...state,
                    additionalInfo: formData
                }
            })
        } catch (error: any) {
            console.error("Submit info failed:", error)
            setErrors({
                api: error?.data?.message || "Failed to submit information. Please try again."
            })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        // Handle state change to reset LGA and update selectedState
        if (name === "state") {
            setSelectedState(value)
            setFormData(prev => ({ ...prev, [name]: value, lga: "" })) // Reset LGA when state changes
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const isFormValid = formData.state && formData.lga && formData.certificateNo && formData.issuedDate && formData.plateNo && formData.purpose && formData.ownerName && formData.ownerAddress && formData.make && formData.model && formData.engineNo && formData.chassisNo && formData.title && formData.phone && formData.email

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
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Additional Information
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Please provide the following information as shown on your ownership certificate. For security reasons you will also be required to upload a digital copy
                        </p>
                    </div>

                    {/* Card Content */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* Location Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* State */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        disabled={statesLoading}
                                        className={`w-full border-2 ${errors.state ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                    >
                                        <option value="">
                                            {statesLoading ? "Loading states..." : "Select State"}
                                        </option>
                                        {statesData?.map((stateItem, index) => (
                                            <option key={index} value={stateItem}>
                                                {stateItem}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.state && <p className="mt-2 text-sm text-red-600 font-medium">{errors.state}</p>}
                                </div>

                                {/* LGA */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        LGA <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="lga"
                                        value={formData.lga}
                                        onChange={handleChange}
                                        disabled={lgasLoading || !selectedState}
                                        className={`w-full border-2 ${errors.lga ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                    >
                                        <option value="">
                                            {!selectedState ? "Select state first" : lgasLoading ? "Loading LGAs..." : "Select LGA"}
                                        </option>
                                        {lgasData?.map((lga) => (
                                            <option key={lga.id} value={lga.id}>
                                                {lga.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.lga && <p className="mt-2 text-sm text-red-600 font-medium">{errors.lga}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Rest of the form remains the same... */}
                        {/* Certificate Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                    <Hash className="w-5 h-5 text-[#B41662]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Certificate Details</h3>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Certificate No */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        Certificate Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="certificateNo"
                                        value={formData.certificateNo}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.certificateNo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        placeholder="Enter certificate number"
                                    />
                                    {errors.certificateNo && <p className="mt-2 text-sm text-red-600 font-medium">{errors.certificateNo}</p>}
                                </div>

                                {/* Issue Date */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Issue Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="issuedDate"
                                        value={formData.issuedDate}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.issuedDate ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                    />
                                    {errors.issuedDate && <p className="mt-2 text-sm text-red-600 font-medium">{errors.issuedDate}</p>}
                                </div>

                                {/* Plate Number */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Plate Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="plateNo"
                                        value={formData.plateNo}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.plateNo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        placeholder="Enter plate number"
                                    />
                                    {errors.plateNo && <p className="mt-2 text-sm text-red-600 font-medium">{errors.plateNo}</p>}
                                </div>

                                {/* Purpose */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Purpose <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.purpose ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        placeholder="Enter purpose"
                                    />
                                    {errors.purpose && <p className="mt-2 text-sm text-red-600 font-medium">{errors.purpose}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Owner Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <User className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Owner Information</h3>
                            </div>
                            <div className="p-5 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Title */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        />
                                        {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>}
                                    </div>

                                    {/* Owner Name */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.ownerName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                            placeholder="Enter owner name"
                                        />
                                        {errors.ownerName && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerName}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                            placeholder="Enter phone number"
                                        />
                                        {errors.phone && <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                            placeholder="Enter email address"
                                        />
                                        {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Owner Address */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="ownerAddress"
                                        value={formData.ownerAddress}
                                        onChange={handleChange}
                                        rows={3}
                                        className={`w-full border-2 ${errors.ownerAddress ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all resize-none`}
                                        placeholder="Enter owner address"
                                    />
                                    {errors.ownerAddress && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerAddress}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                    <Car className="w-5 h-5 text-[#B41662]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Vehicle Details</h3>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Make */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Make <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="make"
                                        value={formData.make}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.make ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        placeholder="Enter make"
                                    />
                                    {errors.make && <p className="mt-2 text-sm text-red-600 font-medium">{errors.make}</p>}
                                </div>

                                {/* Model */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Model <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.model ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        placeholder="Enter model"
                                    />
                                    {errors.model && <p className="mt-2 text-sm text-red-600 font-medium">{errors.model}</p>}
                                </div>

                                {/* Engine Number */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Engine Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="engineNo"
                                        value={formData.engineNo}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.engineNo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        placeholder="Enter engine number"
                                    />
                                    {errors.engineNo && <p className="mt-2 text-sm text-red-600 font-medium">{errors.engineNo}</p>}
                                </div>

                                {/* Chassis Number */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Chassis Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="chassisNo"
                                        value={formData.chassisNo}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.chassisNo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all`}
                                        placeholder="Enter chassis number"
                                    />
                                    {errors.chassisNo && <p className="mt-2 text-sm text-red-600 font-medium">{errors.chassisNo}</p>}
                                </div>
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

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading || !isFormValid}
                                className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${isFormValid && !isLoading
                                    ? 'bg-green-800 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                    : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <FileText className="w-5 h-5" />
                                <span>{isLoading ? "Submitting..." : "Continue"}</span>
                                {!isLoading && isFormValid && (
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
                    All fields marked with * are required
                </p>
            </div>
        </main>
    )
}
