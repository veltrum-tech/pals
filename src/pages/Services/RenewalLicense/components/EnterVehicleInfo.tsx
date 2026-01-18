import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, Car, Phone, Loader2, ArrowRight, ArrowLeft, FileText, Info } from "lucide-react";
import { useInitiateRenewalMutation } from "@/services/renewalsApi";
import { toast } from "sonner";

export default function EnterVehicleInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const [vin, setVin] = useState(location.state?.vin || "");
    const [ownerPhone, setOwnerPhone] = useState(location.state?.ownerPhone || "");
    const [errors, setErrors] = useState<{ vin?: string; ownerPhone?: string }>({});

    const [initiateRenewal, { isLoading, error }] = useInitiateRenewalMutation();

    const validateForm = (): boolean => {
        const newErrors: { vin?: string; ownerPhone?: string } = {};

        if (!vin.trim()) {
            newErrors.vin = "VIN is required";
        } else if (vin.trim().length < 10) {
            newErrors.vin = "VIN must be at least 10 characters";
        }

        if (!ownerPhone.trim()) {
            newErrors.ownerPhone = "Phone number is required";
        } else if (!/^(\+234|0)[789][01]\d{8}$/.test(ownerPhone.replace(/\s/g, ""))) {
            newErrors.ownerPhone = "Enter a valid Nigerian phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before continuing");
            return;
        }

        try {
            const result = await initiateRenewal({
                vin: vin.trim(),
                ownerPhone: ownerPhone.trim(),
            }).unwrap();

            toast.success("Vehicle found! Proceeding to payment...");

            navigate("/services/renewal-license/payment", {
                state: {
                    vin: vin.trim(),
                    ownerPhone: ownerPhone.trim(),
                    requestId: result.requestId,
                    paymentUrl: result.paymentUrl,
                    reference: result.reference,
                    vehicleInfo: result.vehicleInfo,
                },
            });
        } catch (err) {
            toast.error((err as any)?.data?.message);
        }
    };

    return (
        <div className="min-h-screen py-6 md:py-12">
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
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    License Renewal
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Renew your vehicle registration license
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
                                <span className="text-sm font-semibold text-green-600 hidden sm:block">Vehicle Info</span>
                            </div>
                            <div className="flex-1 h-1 bg-gray-300 mx-3 rounded-full">
                                <div className="w-0 h-full bg-green-600 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <span className="text-sm font-medium text-gray-500 hidden sm:block">Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Vehicle Information Section */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Car className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Vehicle Information</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* VIN Input */}
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
                                                    if (errors.vin) setErrors({ ...errors, vin: undefined });
                                                }}
                                                placeholder="Enter your VIN"
                                                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${errors.vin ? "border-red-500 bg-red-50" : "border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                        {errors.vin && (
                                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.vin}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone Number Input */}
                                    <div>
                                        <label
                                            htmlFor="ownerPhone"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Owner's Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                id="ownerPhone"
                                                value={ownerPhone}
                                                onChange={(e) => {
                                                    setOwnerPhone(e.target.value);
                                                    if (errors.ownerPhone)
                                                        setErrors({ ...errors, ownerPhone: undefined });
                                                }}
                                                placeholder="e.g., 08012345678"
                                                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${errors.ownerPhone ? "border-red-500 bg-red-50" : "border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                        {errors.ownerPhone && (
                                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.ownerPhone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* API Error Display */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {(error as any)?.data?.message ||
                                            "Failed to initiate renewal. Please try again."}
                                    </p>
                                </div>
                            )}

                            {/* Info Box */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-700">
                                        <strong>Note:</strong> Ensure the phone number matches the one registered
                                        with your vehicle. You will receive payment confirmation via SMS.
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Continue to Payment
                                        <ArrowRight className="w-5 h-5" />
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
