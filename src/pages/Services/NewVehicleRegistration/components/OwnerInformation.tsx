import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, UserPlus, User, Phone, Mail, MapPin, CreditCard, Info } from "lucide-react"
import { toast } from "sonner"

interface LocationState {
    vin: string
    vinVerified: boolean
    vehicleInfo?: {
        make: string
        model: string
        year: number
        color: string
    }
}

export default function OwnerInformation() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [formData, setFormData] = useState({
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
        ownerAddress: "",
        ownerNin: "",
        title: ""
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!state || !state.vin) {
        navigate("/services/motor-vehicle-registration/verify-vin")
        return null
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required"
        if (!formData.ownerNin.trim()) {
            newErrors.ownerNin = "NIN is required"
        } else if (!/^\d{11}$/.test(formData.ownerNin)) {
            newErrors.ownerNin = "NIN must be 11 digits"
        }
        if (!formData.ownerPhone.trim()) {
            newErrors.ownerPhone = "Phone number is required"
        } else if (!/^[0-9]{10,15}$/.test(formData.ownerPhone)) {
            newErrors.ownerPhone = "Phone number must be between 10 and 15 digits"
        }
        if (!formData.ownerEmail.trim()) {
            newErrors.ownerEmail = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
            newErrors.ownerEmail = "Invalid email format"
        }
        if (!formData.ownerAddress.trim()) newErrors.ownerAddress = "Address is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) {
            toast.error("Please fill in all required fields correctly")
            return
        }

        toast.success("Owner information saved!")
        navigate("/services/new-vehicle-registration/vehicle-details", {
            state: {
                ...state,
                ownerInfo: formData
            }
        })
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
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Owner Information
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Please provide the vehicle owner's details
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
                                <p className="text-xs text-blue-600 font-medium">VIN</p>
                                <p className="text-sm font-bold text-blue-800 font-mono tracking-wider">{state.vin}</p>
                            </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <User className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Title */}
                                    <div>
                                        <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            Title
                                        </label>
                                        <select
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.title
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all`}
                                        >
                                            <option value="">Select Title</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Dr">Dr</option>
                                            <option value="Prof">Prof</option>
                                            <option value="Chief">Chief</option>
                                        </select>
                                        {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>}
                                    </div>

                                    {/* Owner Name */}
                                    <div>
                                        <label htmlFor="ownerName" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            Full Name
                                        </label>
                                        <input
                                            id="ownerName"
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.ownerName
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all`}
                                            placeholder="Enter full name"
                                        />
                                        {errors.ownerName && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerName}</p>}
                                    </div>

                                    {/* NIN */}
                                    <div>
                                        <label htmlFor="ownerNin" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                            National Identification Number (NIN)
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="ownerNin"
                                                type="text"
                                                name="ownerNin"
                                                value={formData.ownerNin}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 11)
                                                    handleChange({ ...e, target: { ...e.target, name: 'ownerNin', value } } as any)
                                                }}
                                                className={`w-full border-2 ${errors.ownerNin
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                    } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base font-mono transition-all`}
                                                placeholder="11-digit NIN"
                                                maxLength={11}
                                            />
                                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium ${formData.ownerNin.length === 11 ? 'text-green-600' : 'text-gray-400'
                                                }`}>
                                                {formData.ownerNin.length}/11
                                            </span>
                                        </div>
                                        {errors.ownerNin && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerNin}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label htmlFor="ownerPhone" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            Phone Number
                                        </label>
                                        <input
                                            id="ownerPhone"
                                            type="tel"
                                            name="ownerPhone"
                                            value={formData.ownerPhone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 15)
                                                handleChange({ ...e, target: { ...e.target, name: 'ownerPhone', value } } as any)
                                            }}
                                            className={`w-full border-2 ${errors.ownerPhone
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all`}
                                            placeholder="080 or 070 number"
                                        />
                                        {errors.ownerPhone && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerPhone}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                    <Mail className="w-5 h-5 text-[#B41662]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                            </div>
                            <div className="p-5 space-y-5">
                                {/* Email */}
                                <div>
                                    <label htmlFor="ownerEmail" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        Email Address
                                    </label>
                                    <input
                                        id="ownerEmail"
                                        type="email"
                                        name="ownerEmail"
                                        value={formData.ownerEmail}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.ownerEmail
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                            } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all`}
                                        placeholder="example@email.com"
                                    />
                                    {errors.ownerEmail && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerEmail}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label htmlFor="ownerAddress" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        Residential Address
                                    </label>
                                    <textarea
                                        id="ownerAddress"
                                        name="ownerAddress"
                                        value={formData.ownerAddress}
                                        onChange={handleChange}
                                        rows={3}
                                        className={`w-full border-2 ${errors.ownerAddress
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                            } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all resize-none`}
                                        placeholder="Enter full address"
                                    />
                                    {errors.ownerAddress && <p className="mt-2 text-sm text-red-600 font-medium">{errors.ownerAddress}</p>}
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
                                className="flex-1 sm:flex-none flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>Continue</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Your information is securely processed
                </p>
            </div>
        </main>
    )
}
