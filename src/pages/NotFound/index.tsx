import { useNavigate } from "react-router-dom"
import { ArrowLeft, Home, AlertCircle } from "lucide-react"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <main className="container mx-auto min-h-screen flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Number */}
                <div className="mb-6">
                    <h1 className="text-9xl md:text-[12rem] font-bold text-secondary/20">
                        404
                    </h1>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6 -mt-16">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-6">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                <p className="text-base text-gray-500 mb-10">
                    Please check the URL or return to the homepage to find what you're looking for.
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
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                    >
                        <Home size={20} />
                        <span>Go to Homepage</span>
                    </button>
                </div>

                {/* Additional Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">
                        Here are some helpful links instead:
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate("/services")}
                            className="text-sm text-secondary hover:underline"
                        >
                            View All Services
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            onClick={() => navigate("/home")}
                            className="text-sm text-secondary hover:underline"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
