import { Mail, CheckCircle2, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PaymentSuccessModalProps {
    isOpen: boolean
    userEmail?: string
    applicationName: string
    onClose?: () => void
    redirectPath?: string
}

export default function PaymentSuccessModal({
    isOpen,
    userEmail = "your registered email",
    applicationName,
    onClose,
    redirectPath = "/home"
}: PaymentSuccessModalProps) {
    const navigate = useNavigate()

    if (!isOpen) return null

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
        navigate(redirectPath)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Success Icon */}
                <div className="bg-linear-to-b from-green-50 to-green-100/50 px-6 pt-8 pb-6 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce" style={{ animationDuration: "2s" }}>
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-8 text-center">
                    {/* Heading */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Payment Successful!
                    </h2>

                    {/* Subheading */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Your <span className="font-semibold text-gray-900">{applicationName}</span> application has been submitted successfully.
                    </p>

                    {/* Email Update Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-blue-900 mb-1">
                                    Email Updates
                                </p>
                                <p className="text-sm text-blue-800">
                                    You will receive email updates about your application progress at <span className="font-semibold">{userEmail}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What to Expect */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-medium text-amber-900 mb-3">
                            What to expect:
                        </p>
                        <ul className="space-y-2 text-sm text-amber-800">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold mt-0.5">•</span>
                                <span>We'll review your documents and process your application</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold mt-0.5">•</span>
                                <span>You'll receive status updates via email</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold mt-0.5">•</span>
                                <span>Processing typically takes 1-7 business days</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold mt-0.5">•</span>
                                <span>Contact support if you don't receive updates</span>
                            </li>
                        </ul>
                    </div>

                    {/* Reference Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-6">
                        <p className="text-xs text-gray-600 mb-1">
                            Keep this reference for your records
                        </p>
                        <p className="text-sm font-mono text-gray-900 break-all">
                            Ref: {new Date().getTime()}
                        </p>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}
