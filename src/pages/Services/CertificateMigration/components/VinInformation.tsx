import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Check, Car, Shield } from "lucide-react"

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

export default function VinInformation() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState

    const [checkbox1, setCheckbox1] = useState(false)
    const [checkbox2, setCheckbox2] = useState(false)

    if (!state || !state.requestId) {
        navigate("/services/certificate-migration/enter-vin")
        return null
    }

    const handleContinue = () => {
        if (checkbox1 && checkbox2) {
            navigate("/services/certificate-migration/additional-information", {
                state: state
            })
        }
    }

    const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
        <div
            onClick={onChange}
            className={`flex items-center gap-4 p-4 rounded border-2 cursor-pointer transition-all duration-300 ${checked
                    ? 'border-[#B41662] bg-[#B41662]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30'
                }`}
        >
            <div
                className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${checked
                        ? 'border-[#B41662] bg-[#B41662] scale-110'
                        : 'border-gray-300 bg-white'
                    }`}
            >
                {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${checked ? 'text-[#B41662]' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${checked ? 'text-gray-900' : 'text-gray-600'}`}>
                    {label}
                </span>
            </div>
        </div>
    )

    const InfoItem = ({ label, value }: { label: string; value: string }) => (
        <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-gray-900 font-semibold">{value}</p>
        </div>
    )

    const bothChecked = checkbox1 && checkbox2

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
                                Vehicle Information
                            </h1>
                        </div>
                        <p className="text-green-100 text-sm md:text-base">
                            Please review the vehicle information displayed below
                        </p>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8 space-y-6">
                        {/* Request ID Badge */}
                        {/* <div className="inline-flex items-center gap-3 py-2.5">
                            <Hash className="w-5 h-5 text-green-600" />
                            <div>
                                <span className="text-xs text-green-600 font-medium uppercase tracking-wide">Request ID</span>
                                <p className="text-green-800 font-bold text-lg -mt-0.5">{state.requestId}</p>
                            </div>
                        </div> */}

                        {/* Vehicle Details Card */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Car className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Vehicle Details</h3>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div className="col-span-2 lg:col-span-3">
                                        <InfoItem label="VIN" value={state.vin} />
                                    </div>
                                    <InfoItem label="Make" value={state.vehicleInfo.make} />
                                    <InfoItem label="Model" value={state.vehicleInfo.model} />
                                    <InfoItem label="Year" value={state.vehicleInfo.year} />
                                    {state.vehicleInfo.color && (
                                        <InfoItem label="Color" value={state.vehicleInfo.color} />
                                    )}
                                    {state.vehicleInfo.type && (
                                        <InfoItem label="Type" value={state.vehicleInfo.type} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Checkboxes */}
                        <div className="space-y-3">
                            <CustomCheckbox
                                checked={checkbox1}
                                onChange={() => setCheckbox1(!checkbox1)}
                                label="This is the correct vehicle to be processed"
                            />
                            <CustomCheckbox
                                checked={checkbox2}
                                onChange={() => setCheckbox2(!checkbox2)}
                                label="I am the owner of this vehicle or the authorized representative of the owner"
                            />
                        </div>

                        {/* Continue Button */}
                        <div className="pt-4 border-t border-gray-100">
                            <button
                                onClick={handleContinue}
                                disabled={!bothChecked}
                                className={`w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 rounded font-semibold text-white transition-all duration-300 shadow-lg ${bothChecked
                                        ? 'bg-green-600 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0'
                                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <span>Continue</span>
                                {bothChecked && (
                                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Please confirm both checkboxes to continue
                </p>
            </div>
        </main>
    )
}
