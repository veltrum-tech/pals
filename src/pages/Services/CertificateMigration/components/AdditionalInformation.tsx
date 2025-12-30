import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useSubmitInfoMutation } from "../../../../services/migrationsApi"
import { useGetLGAsQuery } from "../../../../services/lgaApi"

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
    const { data: lgasData, isLoading: lgasLoading } = useGetLGAsQuery("Jigawa")

    const [formData, setFormData] = useState({
        state: "Jigawa",
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

            // Navigate to next step on success
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
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
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
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        {/* Step Header */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Additional Information
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please provide the following information for certificate migration
                        </p>                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    disabled
                                    className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary bg-gray-100 cursor-not-allowed`}
                                >
                                    <option value="Jigawa">Jigawa</option>
                                </select>
                                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                            </div>

                            {/* LGA */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    LGA <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="lga"
                                    value={formData.lga}
                                    onChange={handleChange}
                                    disabled={lgasLoading}
                                    className={`w-full border ${errors.lga ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >
                                    <option value="">
                                        {lgasLoading ? "Loading LGAs..." : "Select LGA"}
                                    </option>
                                    {lgasData?.map((lga) => (
                                        <option key={lga.id} value={lga.id}>
                                            {lga.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.lga && <p className="mt-1 text-sm text-red-600">{errors.lga}</p>}
                            </div>

                            {/* Certificate No */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Certificate Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="certificateNo"
                                    value={formData.certificateNo}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.certificateNo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter certificate number"
                                />
                                {errors.certificateNo && <p className="mt-1 text-sm text-red-600">{errors.certificateNo}</p>}
                            </div>

                            {/* Issue Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Issue Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="issuedDate"
                                    value={formData.issuedDate}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.issuedDate ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                />
                                {errors.issuedDate && <p className="mt-1 text-sm text-red-600">{errors.issuedDate}</p>}
                            </div>

                            {/* Plate Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Plate Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="plateNo"
                                    value={formData.plateNo}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.plateNo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter plate number"
                                />
                                {errors.plateNo && <p className="mt-1 text-sm text-red-600">{errors.plateNo}</p>}
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Purpose <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.purpose ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter purpose"
                                />
                                {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
                            </div>

                            {/* Owner Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.ownerName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter owner name"
                                />
                                {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
                            </div>

                            {/* Owner Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="ownerAddress"
                                    value={formData.ownerAddress}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full border ${errors.ownerAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter owner address"
                                />
                                {errors.ownerAddress && <p className="mt-1 text-sm text-red-600">{errors.ownerAddress}</p>}
                            </div>

                            {/* Make */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Make <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.make ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter make"
                                />
                                {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make}</p>}
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Model <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.model ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter model"
                                />
                                {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                            </div>

                            {/* Engine Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Engine Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="engineNo"
                                    value={formData.engineNo}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.engineNo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter engine number"
                                />
                                {errors.engineNo && <p className="mt-1 text-sm text-red-600">{errors.engineNo}</p>}
                            </div>

                            {/* Chassis Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chassis Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="chassisNo"
                                    value={formData.chassisNo}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.chassisNo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter chassis number"
                                />
                                {errors.chassisNo && <p className="mt-1 text-sm text-red-600">{errors.chassisNo}</p>}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                >
                                    <option value="">Select Title</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Dr">Dr</option>
                                </select>
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>
                        </div>

                        {/* API Error Display */}
                        {errors.api && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{errors.api}</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:max-w-md py-3 px-6 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Submitting..." : "Continue"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
