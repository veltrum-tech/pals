import { useNavigate, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Car,
    DollarSign,
    Receipt,
    Percent,
    BadgeCheck,
    Check,
    Printer,
    RotateCcw,
} from "lucide-react";
import type { ValuationResponse } from "@/types/valuation";

interface LocationState {
    valuation: ValuationResponse;
}

export default function ValuationResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    if (!state?.valuation) {
        navigate("/services/vehicle-valuation");
        return null;
    }

    const { valuation } = state;

    const formatCurrency = (amount: number, currency: "USD" | "NGN" = "NGN") => {
        const symbol = currency === "USD" ? "$" : "₦";
        return `${symbol}${amount.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const InfoRow = ({
        label,
        value,
        highlight = false,
        large = false,
    }: {
        label: string;
        value: string;
        highlight?: boolean;
        large?: boolean;
    }) => (
        <div className={`flex justify-between items-start py-3 border-b border-gray-100 last:border-0 ${large ? "py-4" : ""}`}>
            <span className={`text-gray-500 ${large ? "text-base font-medium" : "text-sm"}`}>{label}</span>
            <span
                className={`font-semibold text-right ${
                    highlight
                        ? "text-green-600"
                        : large
                        ? "text-lg text-gray-900"
                        : "text-sm text-gray-900"
                }`}
            >
                {value}
            </span>
        </div>
    );

    const handlePrint = () => {
        window.print();
    };

    const handleNewCalculation = () => {
        navigate("/services/vehicle-valuation");
    };

    return (
        <div className="min-h-screen py-6 md:py-12">
            <div className="container mx-auto px-3 md:px-4 max-w-3xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/services")}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors group print:hidden"
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
                                <BadgeCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Valuation Complete
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Vehicle duties and taxes calculated
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 print:hidden">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-green-600 hidden sm:block">Enter VIN</span>
                            </div>
                            <div className="flex-1 h-1 bg-green-600 mx-3 rounded-full"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                                    2
                                </div>
                                <span className="text-sm font-semibold text-green-600 hidden sm:block">View Result</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-6">
                        {/* Vehicle Details Section */}
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Car className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">Vehicle Information</h3>
                            </div>

                            <div className="space-y-0">
                                <InfoRow label="VIN" value={valuation.vin} />
                                <InfoRow label="Make" value={valuation.make} />
                                <InfoRow label="Model" value={valuation.model} />
                                <InfoRow label="Year" value={valuation.year.toString()} />
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">Vehicle Price</h3>
                            </div>

                            <div className="space-y-0">
                                <InfoRow label="Price (USD)" value={formatCurrency(valuation.priceUSD, "USD")} />
                                <InfoRow label="Price (NGN)" value={formatCurrency(valuation.priceNGN, "NGN")} highlight />
                            </div>
                        </div>

                        {/* Duties & Taxes Section */}
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Percent className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">Duties & Taxes</h3>
                            </div>

                            <div className="space-y-0">
                                <InfoRow label="Customs Duty" value={formatCurrency(valuation.customsDuty)} />
                                <InfoRow label="VAT" value={formatCurrency(valuation.vat)} />
                                <InfoRow label="Levy" value={formatCurrency(valuation.levy)} />
                            </div>
                        </div>

                        {/* Total Value Section */}
                        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                                    <Receipt className="w-5 h-5 text-green-700" />
                                </div>
                                <h3 className="font-semibold text-green-800">Total Value</h3>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-green-700 font-medium">Total Payable Amount</span>
                                <span className="text-2xl font-bold text-green-700">
                                    {formatCurrency(valuation.totalValue)}
                                </span>
                            </div>
                            <p className="text-sm text-green-600 mt-2">
                                This includes the vehicle price, customs duty, VAT, and levy.
                            </p>
                        </div>

                        {/* Summary Breakdown */}
                        <div className="bg-gray-100 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Breakdown Summary</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Price (NGN)</p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {formatCurrency(valuation.priceNGN)}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Customs</p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {formatCurrency(valuation.customsDuty)}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-1">VAT</p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {formatCurrency(valuation.vat)}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Levy</p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {formatCurrency(valuation.levy)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
                            <button
                                onClick={handlePrint}
                                className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                Print Result
                            </button>
                            <button
                                onClick={handleNewCalculation}
                                className="flex-1 py-4 bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                New Calculation
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="mt-6 text-center text-xs text-gray-500 print:hidden">
                    This valuation is for informational purposes only. Actual duties and taxes may vary based on current regulations.
                </p>
            </div>
        </div>
    );
}
