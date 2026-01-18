import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Car, Settings, Hash, Palette, Calendar, Cog, Truck, Info } from "lucide-react"
import { toast } from "sonner"

interface LocationState {
    vin: string
    vinVerified: boolean
    vehicleInfo?: any
    ownerInfo: {
        ownerName: string
        ownerPhone: string
        ownerEmail: string
        ownerAddress: string
        ownerNin: string
        title: string
    }
}

export default function VehicleDetails() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [formData, setFormData] = useState({
        vehicleMake: state?.vehicleInfo?.make || "",
        vehicleModel: state?.vehicleInfo?.model || "",
        vehicleYear: state?.vehicleInfo?.year || "",
        vehicleColor: state?.vehicleInfo?.color || "",
        engineNumber: "",
        chassisNumber: "",
        vehicleType: "",
        plateNumber: ""
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!state || !state.vin) {
        navigate("/services/new-vehicle-registration/verify-vin")
        return null
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.vehicleMake.trim()) newErrors.vehicleMake = "Vehicle make is required"
        if (!formData.vehicleModel.trim()) newErrors.vehicleModel = "Vehicle model is required"
        if (!formData.vehicleYear) {
            newErrors.vehicleYear = "Vehicle year is required"
        } else if (!/^\d{4}$/.test(formData.vehicleYear.toString())) {
            newErrors.vehicleYear = "Vehicle year must be a valid year"
        }
        if (!formData.vehicleColor.trim()) newErrors.vehicleColor = "Vehicle color is required"
        if (!formData.engineNumber.trim()) newErrors.engineNumber = "Engine number is required"
        if (!formData.chassisNumber.trim()) newErrors.chassisNumber = "Chassis number is required"
        if (!formData.vehicleType.trim()) newErrors.vehicleType = "Vehicle type is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

        toast.success("Vehicle details saved!")
        navigate("/services/new-vehicle-registration/upload-documents", {
            state: {
                ...state,
                vehicleDetails: formData
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
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Vehicle Details
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Please provide complete vehicle specifications
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

                        {/* Basic Vehicle Information Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Car className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Vehicle Make */}
                                    <div>
                                        <label htmlFor="vehicleMake" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Car className="w-4 h-4 text-gray-400" />
                                            Vehicle Make
                                        </label>
                                        <input
                                            id="vehicleMake"
                                            type="text"
                                            name="vehicleMake"
                                            value={formData.vehicleMake}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.vehicleMake
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all ${state?.vehicleInfo?.make ? 'bg-gray-50' : ''
                                                }`}
                                            placeholder="e.g., Toyota"
                                            disabled={!!state?.vehicleInfo?.make}
                                        />
                                        {errors.vehicleMake && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vehicleMake}</p>}
                                    </div>

                                    {/* Vehicle Model */}
                                    <div>
                                        <label htmlFor="vehicleModel" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Settings className="w-4 h-4 text-gray-400" />
                                            Vehicle Model
                                        </label>
                                        <input
                                            id="vehicleModel"
                                            type="text"
                                            name="vehicleModel"
                                            value={formData.vehicleModel}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.vehicleModel
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all ${state?.vehicleInfo?.model ? 'bg-gray-50' : ''
                                                }`}
                                            placeholder="e.g., Camry"
                                            disabled={!!state?.vehicleInfo?.model}
                                        />
                                        {errors.vehicleModel && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vehicleModel}</p>}
                                    </div>

                                    {/* Vehicle Year */}
                                    <div>
                                        <label htmlFor="vehicleYear" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            Year of Manufacture
                                        </label>
                                        <input
                                            id="vehicleYear"
                                            type="number"
                                            name="vehicleYear"
                                            value={formData.vehicleYear}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.vehicleYear
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all ${state?.vehicleInfo?.year ? 'bg-gray-50' : ''
                                                }`}
                                            placeholder="e.g., 2020"
                                            disabled={!!state?.vehicleInfo?.year}
                                        />
                                        {errors.vehicleYear && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vehicleYear}</p>}
                                    </div>

                                    {/* Vehicle Color */}
                                    <div>
                                        <label htmlFor="vehicleColor" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Palette className="w-4 h-4 text-gray-400" />
                                            Vehicle Color
                                        </label>
                                        <input
                                            id="vehicleColor"
                                            type="text"
                                            name="vehicleColor"
                                            value={formData.vehicleColor}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.vehicleColor
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all ${state?.vehicleInfo?.color ? 'bg-gray-50' : ''
                                                }`}
                                            placeholder="e.g., Blue"
                                            disabled={!!state?.vehicleInfo?.color}
                                        />
                                        {errors.vehicleColor && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vehicleColor}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Details Section */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-[#B41662]/10 rounded-lg">
                                    <Cog className="w-5 h-5 text-[#B41662]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Technical Details</h3>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Engine Number */}
                                    <div>
                                        <label htmlFor="engineNumber" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Cog className="w-4 h-4 text-gray-400" />
                                            Engine Number
                                        </label>
                                        <input
                                            id="engineNumber"
                                            type="text"
                                            name="engineNumber"
                                            value={formData.engineNumber}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.engineNumber
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base font-mono transition-all`}
                                            placeholder="Enter engine number"
                                        />
                                        {errors.engineNumber && <p className="mt-2 text-sm text-red-600 font-medium">{errors.engineNumber}</p>}
                                    </div>

                                    {/* Chassis Number */}
                                    <div>
                                        <label htmlFor="chassisNumber" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Hash className="w-4 h-4 text-gray-400" />
                                            Chassis Number
                                        </label>
                                        <input
                                            id="chassisNumber"
                                            type="text"
                                            name="chassisNumber"
                                            value={formData.chassisNumber}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.chassisNumber
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base font-mono transition-all`}
                                            placeholder="Enter chassis number"
                                        />
                                        {errors.chassisNumber && <p className="mt-2 text-sm text-red-600 font-medium">{errors.chassisNumber}</p>}
                                    </div>

                                    {/* Vehicle Type */}
                                    <div>
                                        <label htmlFor="vehicleType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Truck className="w-4 h-4 text-gray-400" />
                                            Vehicle Type
                                        </label>
                                        <select
                                            id="vehicleType"
                                            name="vehicleType"
                                            value={formData.vehicleType}
                                            onChange={handleChange}
                                            className={`w-full border-2 ${errors.vehicleType
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                                } rounded-lg px-4 py-3.5 focus:outline-none focus:ring-4 text-base transition-all`}
                                        >
                                            <option value="">Select Vehicle Type</option>
                                            <option value="Sedan">Sedan</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Pickup">Pickup</option>
                                            <option value="Van">Van</option>
                                            <option value="Truck">Truck</option>
                                            <option value="Bus">Bus</option>
                                            <option value="Motorcycle">Motorcycle</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.vehicleType && <p className="mt-2 text-sm text-red-600 font-medium">{errors.vehicleType}</p>}
                                    </div>
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
