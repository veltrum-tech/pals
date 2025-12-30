import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
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

            // Navigate to review page on success
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
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        {/* Step Header */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            New Owner Information
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please provide the information for the new vehicle owner
                        </p>                        {/* Form Fields */}
                        <div className="space-y-6">
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
                                    placeholder="Enter new owner's full name"
                                />
                                {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
                            </div>

                            {/* Owner Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="ownerAddress"
                                    value={formData.ownerAddress}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full border ${errors.ownerAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-secondary`}
                                    placeholder="Enter new owner's address"
                                />
                                {errors.ownerAddress && <p className="mt-1 text-sm text-red-600">{errors.ownerAddress}</p>}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
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
