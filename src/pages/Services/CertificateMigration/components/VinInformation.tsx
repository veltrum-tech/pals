import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"

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

    // Redirect if no state
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
        <div className="flex items-start gap-3">
            <button
                type="button"
                onClick={onChange}
                className="shrink-0 w-6 h-6 mt-0.5 rounded border-2 border-[#B41662] flex items-center justify-center cursor-pointer transition-colors"
                style={{ backgroundColor: checked ? "#B41662" : "white" }}
            >
                {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </button>
            <label onClick={onChange} className="text-sm text-gray-900 cursor-pointer leading-relaxed">
                {label}
            </label>
        </div>
    )

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

            {/* Content Section */}
            <section className="bg-white p-6 md:p-8">
                <div className="flex flex-col min-h-[60vh] justify-between">
                    <div>
                        {/* Step Header */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Vehicle Information
                        </h2>

                        <p className="text-gray-600 text-base mb-8">
                            Please verify the vehicle information below
                        </p>                        {/* Request ID */}
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Request ID:</strong> {state.requestId}
                            </p>
                        </div>

                        {/* Vehicle Information Card */}
                        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">VIN</p>
                                    <p className="text-base text-gray-900 font-medium">{state.vin}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Make</p>
                                    <p className="text-base text-gray-900 font-medium">{state.vehicleInfo.make}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Model</p>
                                    <p className="text-base text-gray-900 font-medium">{state.vehicleInfo.model}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Year</p>
                                    <p className="text-base text-gray-900 font-medium">{state.vehicleInfo.year}</p>
                                </div>
                                {state.vehicleInfo.color && (
                                    <div>
                                        <p className="text-sm text-gray-500">Color</p>
                                        <p className="text-base text-gray-900 font-medium">{state.vehicleInfo.color}</p>
                                    </div>
                                )}
                                {state.vehicleInfo.type && (
                                    <div>
                                        <p className="text-sm text-gray-500">Type</p>
                                        <p className="text-base text-gray-900 font-medium">{state.vehicleInfo.type}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Confirmation Checkboxes */}
                        <div className="border-2 border-[#B41662] rounded-lg p-6 space-y-4">
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
                    </div>

                    {/* Continue Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleContinue}
                            disabled={!checkbox1 || !checkbox2}
                            className="w-full md:max-w-md py-3 px-6 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}
