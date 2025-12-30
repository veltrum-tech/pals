import { useNavigate } from "react-router-dom"
import { ArrowLeft, Clock } from "lucide-react"

export default function ComingSoon() {
    const navigate = useNavigate()

    return (
        <main className="container mx-auto min-h-screen flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Clock className="w-12 h-12 text-secondary" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Coming Soon
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8">
                    This service is currently under development. We're working hard to bring you this feature soon.
                </p>

                <p className="text-base text-gray-500 mb-10">
                    In the meantime, please explore our other available services or check back later.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-secondary text-secondary rounded-lg font-medium hover:bg-secondary hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Go Back</span>
                    </button>

                    <button
                        onClick={() => navigate("/home")}
                        className="px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                    >
                        Go to Homepage
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        For urgent inquiries, please contact our support team.
                    </p>
                </div>
            </div>
        </main>
    )
}
