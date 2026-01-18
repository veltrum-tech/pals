import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Car,
    Calculator,
    Loader2,
    AlertCircle,
    Info,
} from "lucide-react";
import { useCalculateValuationMutation } from "@/services/valuationApi";
import { toast } from "sonner";

export default function EnterVin() {
    const navigate = useNavigate();
    const [vin, setVin] = useState("");
    const [error, setError] = useState("");

    const [calculateValuation, { isLoading }] = useCalculateValuationMutation();

    const validateVin = (): boolean => {
        if (!vin.trim()) {
            setError("VIN is required");
            return false;
        }
        if (vin.trim().length < 10) {
            setError("VIN must be at least 10 characters");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateVin()) {
            toast.error("Please enter a valid VIN");
            return;
        }

        try {
            const result = await calculateValuation({
                vin: vin.trim(),
            }).unwrap();

            toast.success("Vehicle valuation calculated successfully!");

            navigate("/services/vehicle-valuation/result", {
                state: {
                    valuation: result,
                },
            });
        } catch (err: any) {
            const errorMessage = err?.data?.message || "Failed to calculate valuation. Please try again.";
            toast.error(errorMessage);
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen  py-6 md:py-12">
            <div className="container mx-auto px-3 md:px-4 max-w-2xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/services")}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Services</span>
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Calculator className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Vehicle Valuation & VAT
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Calculate customs duty, VAT, and total value
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                                    1
                                </div>
                                <span className="text-sm font-semibold text-green-600 hidden sm:block">Enter VIN</span>
                            </div>
                            <div className="flex-1 h-1 bg-gray-300 mx-3 rounded-full">
                                <div className="w-0 h-full bg-green-600 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <span className="text-sm font-medium text-gray-500 hidden sm:block">View Result</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* VIN Input Section */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Car className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Vehicle Identification</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="vin"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Vehicle Identification Number (VIN) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                id="vin"
                                                value={vin}
                                                onChange={(e) => {
                                                    setVin(e.target.value.toUpperCase());
                                                    if (error) setError("");
                                                }}
                                                placeholder="Enter your VIN (e.g., 1HGCM82633A004352)"
                                                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                                                    error ? "border-red-500 bg-red-50" : "border-gray-300"
                                                }`}
                                            />
                                        </div>
                                        {error && (
                                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {error}
                                            </p>
                                        )}
                                        <p className="mt-2 text-xs text-gray-500">
                                            The VIN is typically found on the dashboard near the windshield or on the driver's side door jamb.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-blue-800 mb-1">What you'll get:</p>
                                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                            <li>Vehicle details (Make, Model, Year)</li>
                                            <li>Price in USD and NGN</li>
                                            <li>Customs Duty calculation</li>
                                            <li>VAT calculation</li>
                                            <li>Levy and Total Value</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Calculating...
                                    </>
                                ) : (
                                    <>
                                        <Calculator className="w-5 h-5" />
                                        Calculate Valuation
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Help Text */}
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Need help finding your VIN?{" "}
                            <a href="#" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                                Learn more
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
