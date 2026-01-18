import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Car,
    Calendar,
    CreditCard,
    Loader2,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    User,
    Wallet,
    Info,
    Check,
} from "lucide-react";
import { useVerifyRenewalPaymentMutation } from "@/services/renewalsApi";
import PaymentSuccessModal from "@/components/ui/payment-success-modal";
import { toast } from "sonner";

interface LocationState {
    vin: string;
    ownerPhone: string;
    requestId: string;
    paymentUrl: string;
    reference: string;
    vehicleInfo?: {
        vin: string;
        make: string;
        model: string;
        year: number;
        color: string;
        ownerName: string;
        plateNumber: string;
        currentExpiryDate: string;
        newExpiryDate: string;
    };
}

export default function PaymentConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const [paymentStatus, setPaymentStatus] = useState<
        "pending" | "processing" | "success" | "failed"
    >("pending");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [verifyPayment, { isLoading: isVerifying }] = useVerifyRenewalPaymentMutation();

    useEffect(() => {
        if (!state?.requestId) {
            toast.error("Missing renewal information. Please start again.");
            navigate("/services/renewal-license");
        }
    }, [state, navigate]);

    const handlePayment = () => {
        if (state?.paymentUrl) {
            // Store payment info for callback verification
            sessionStorage.setItem("paymentRequestId", state.requestId);
            sessionStorage.setItem("paymentReference", state.reference);
            sessionStorage.setItem("paymentUserEmail", state.ownerPhone);
            sessionStorage.setItem("paymentServiceType", "renewal");

            window.location.href = state.paymentUrl;
        } else {
            toast.error("Payment URL not available");
        }
    };

    const handleVerifyPayment = async () => {
        if (!state?.reference || !state?.requestId) {
            toast.error("Missing payment reference");
            return;
        }

        setPaymentStatus("processing");

        try {
            const result = await verifyPayment({
                requestId: state.requestId,
                data: { reference: state.reference },
            }).unwrap();

            if (result.status === "success") {
                setPaymentStatus("success");
                toast.success("Payment verified successfully!");
                setShowSuccessModal(true);
            } else if (result.status === "pending") {
                setPaymentStatus("pending");
                toast.info("Payment is still pending. Please complete the payment first.");
            } else {
                setPaymentStatus("failed");
                toast.error("Payment verification failed. Please try again.");
            }
        } catch (err) {
            console.error("Payment verification failed:", err);
            setPaymentStatus("failed");
            toast.error("Failed to verify payment. Please try again.");
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        navigate("/services");
    };

    if (!state?.requestId) {
        return null;
    }

    const InfoRow = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
        <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`text-sm font-semibold text-right ${highlight ? "text-green-600" : "text-gray-900"}`}>
                {value}
            </span>
        </div>
    );

    return (
        <div className="min-h-screen  py-6 md:py-12">
            <div className="container mx-auto px-3 md:px-4 max-w-3xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Complete Your Renewal
                                </h1>
                                <p className="text-green-100 mt-1">
                                    Review details and make payment
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-green-600 hidden sm:block">Vehicle Info</span>
                            </div>
                            <div className="flex-1 h-1 bg-green-600 mx-3 rounded-full"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                                    2
                                </div>
                                <span className="text-sm font-semibold text-green-600 hidden sm:block">Payment</span>
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
                                <h3 className="font-semibold text-gray-900">Vehicle Details</h3>
                            </div>

                            {state.vehicleInfo ? (
                                <div className="space-y-0">
                                    <InfoRow label="VIN" value={state.vehicleInfo.vin} />
                                    <InfoRow
                                        label="Vehicle"
                                        value={`${state.vehicleInfo.year} ${state.vehicleInfo.make} ${state.vehicleInfo.model}`}
                                    />
                                    <InfoRow label="Color" value={state.vehicleInfo.color} />
                                    <InfoRow label="Plate Number" value={state.vehicleInfo.plateNumber} highlight />
                                </div>
                            ) : (
                                <div className="space-y-0">
                                    <InfoRow label="VIN" value={state.vin} />
                                    <InfoRow label="Phone Number" value={state.ownerPhone} />
                                </div>
                            )}
                        </div>

                        {/* Owner Information Section */}
                        {state.vehicleInfo && (
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Owner Information</h3>
                                </div>

                                <div className="space-y-0">
                                    <InfoRow label="Owner Name" value={state.vehicleInfo.ownerName} />
                                    <InfoRow label="Phone Number" value={state.ownerPhone} />
                                </div>
                            </div>
                        )}

                        {/* License Expiry Section */}
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">License Status</h3>
                            </div>

                            {state.vehicleInfo ? (
                                <div className="space-y-0">
                                    <InfoRow label="Current Expiry Date" value={state.vehicleInfo.currentExpiryDate} />
                                    <InfoRow label="New Expiry Date" value={state.vehicleInfo.newExpiryDate} highlight />
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 italic">
                                    License expiry information will be updated after verification
                                </div>
                            )}

                            {state.vehicleInfo?.newExpiryDate && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-700">
                                        <strong>Your license will be renewed for 1 year</strong> after successful payment
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Payment Section */}
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">Payment Information</h3>
                            </div>

                            <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
                                <p className="text-sm text-gray-500 mb-1">Payment Reference</p>
                                <p className="font-mono font-semibold text-lg text-gray-900">{state.reference}</p>
                            </div>

                            {/* Status Indicator */}
                            {paymentStatus === "success" && (
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-green-800">Payment Verified!</p>
                                        <p className="text-sm text-green-700">
                                            Your renewal has been approved for 1 year.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {paymentStatus === "failed" && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-red-800">Payment Failed</p>
                                        <p className="text-sm text-red-700">
                                            Please try making the payment again.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-800 mb-2">Payment Instructions</p>
                                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                                        <li>Click "Proceed to Payment" to open the payment page</li>
                                        <li>Complete the payment using your preferred method</li>
                                        <li>Return here and click "Verify Payment"</li>
                                        <li>Your renewal will be auto-approved upon successful verification</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={handlePayment}
                                disabled={paymentStatus === "success"}
                                className="w-full py-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-5 h-5" />
                                Proceed to Payment
                            </button>

                            <button
                                onClick={handleVerifyPayment}
                                disabled={isVerifying || paymentStatus === "success"}
                                className="w-full py-4 bg-white border-2 border-[#B41662] text-[#B41662] hover:bg-[#B41662] hover:text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isVerifying ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying Payment...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        I've Made Payment - Verify
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <PaymentSuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseModal}
                applicationName="License Renewal"
                userEmail={state.ownerPhone}
                redirectPath="/services"
            />
        </div>
    );
}
