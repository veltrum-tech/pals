import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, UserPlus, User, MapPin, Phone, Mail } from "lucide-react"
import { useSubmitTransferMutation } from "../../../../services/transfersApi"

interface LocationState {
    certificateNo: string
    requestId: string
    currentOwner: any
    vehicleInfo: any
    otpVerified: boolean
}

export default function NextOwnerInformation() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [submitTransfer, { isLoading }] = useSubmitTransferMutation()

    const [formData, setFormData] = useState({
        ownerName: "",
        ownerAddress: "",
        phone: "",
        email: ""
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!state || !state.requestId || !state.otpVerified) {
        navigate("/services/change-ownership/enter-cert-no")
        return null
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.ownerName.trim()) {
            newErrors.ownerName = "Owner name is required"
        }
        if (!formData.ownerAddress.trim()) {
            newErrors.ownerAddress = "Owner address is required"
        }
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
            await submitTransfer({
                requestId: state.requestId,
                data: {
                    new_owner_name: formData.ownerName,
                    new_owner_phone: formData.phone,
                    new_owner_email: formData.email,
                    new_owner_address: formData.ownerAddress
                }
            }).unwrap()

            navigate("/services/change-ownership/review-information", {
                state: {
                    ...state,
                    nextOwnerInfo: formData
                }
            })
        } catch (error: any) {
            console.error("Submit transfer failed:", error)
            setErrors({
                api: error?.data?.message || "Failed to submit transfer details. Please try again."
            })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const isFormValid = formData.ownerName && formData.ownerAddress && formData.phone && formData.email

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
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                New Owner Information
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Please provide information of the person or entity that will own this vehicle
                        </p>
                    </div>

                    {/* Card Content */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* Form Fields Card */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                    <User className="w-5 h-5 text-[#B41662]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Owner Details</h3>
                            </div>
                            <div className="p-5 space-y-5">
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
                                        placeholder="Enter new owner's full name"
                                    />
                                    {errors.ownerName && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerName}</p>}
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
                                        placeholder="Enter new owner's address"
                                    />
                                    {errors.ownerAddress && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerAddress}</p>}
                                </div>

                                {/* Phone and Email Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                        ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <UserPlus className="w-5 h-5" />
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
