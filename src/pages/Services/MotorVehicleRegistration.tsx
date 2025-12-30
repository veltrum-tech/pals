import { Car, FileText, RefreshCw, Users, DollarSign, Clock, CheckCircle2, ArrowRight, Shield, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"

const motorVehicleServices = [
    {
        id: 1,
        name: "New Vehicle Registration",
        description: "Register a brand new vehicle for the first time with complete documentation and verification process.",
        icon: Car,
        features: [
            "Complete vehicle inspection",
            "Documentation verification",
            "License plate issuance",
            "Digital certificate"
        ],
        processingTime: "3-5 business days",
        category: "Initial Registration",
        available: false
    },
    {
        id: 2,
        name: "License Renewal",
        description: "Renew your existing vehicle license to keep your registration current and legally compliant.",
        icon: RefreshCw,
        features: [
            "Quick renewal process",
            "Online payment options",
            "Updated documentation",
            "Instant confirmation"
        ],
        processingTime: "1-2 business days",
        category: "Renewal Services",
        available: false
    },
    {
        id: 3,
        name: "Change of Ownership",
        description: "Transfer vehicle ownership from seller to buyer with proper legal documentation and verification.",
        icon: Users,
        features: [
            "Ownership verification",
            "Document transfer",
            "Updated registration",
            "New certificate issuance"
        ],
        processingTime: "2-3 business days",
        category: "Transfer Services",
        available: true
    },
    {
        id: 4,
        name: "Certificate Migration",
        description: "Migrate your vehicle certificate from another state to Jigawa State with seamless transfer process.",
        icon: FileText,
        features: [
            "Interstate verification",
            "Document validation",
            "State transfer approval",
            "New state certificate"
        ],
        processingTime: "5-7 business days",
        category: "Migration Services",
        available: true
    },
    {
        id: 5,
        name: "Vehicle Valuation & VAT",
        description: "Get professional vehicle valuation for tax purposes and VAT assessment services.",
        icon: DollarSign,
        features: [
            "Professional assessment",
            "Market value analysis",
            "VAT calculation",
            "Official valuation report"
        ],
        processingTime: "2-4 business days",
        category: "Assessment Services",
        available: false
    }
]

export default function MotorVehicleRegistration() {
    const navigate = useNavigate()

    const handleServiceClick = (service: typeof motorVehicleServices[0]) => {
        if (!service.available) return

        if (service.id === 4) {
            // Certificate Migration
            navigate("/services/certificate-migration/enter-vin")
        } else if (service.id === 3) {
            // Change of Ownership
            navigate("/services/change-ownership/enter-cert-no")
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-secondary py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white/80">Vehicle Services</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Motor Vehicle Registration
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl">
                        Complete motor vehicle registration services including new registrations, renewals, transfers, and valuations. Fast, secure, and fully digital.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">5</div>
                                <div className="text-sm text-gray-600">Services</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">24/7</div>
                                <div className="text-sm text-gray-600">Online Access</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">100%</div>
                                <div className="text-sm text-gray-600">Secure</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">1-7</div>
                                <div className="text-sm text-gray-600">Days Processing</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Services</h2>
                    <p className="text-gray-600">Choose the service you need and start your application process</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {motorVehicleServices.map((service) => {
                        const Icon = service.icon
                        return (
                            <div
                                key={service.id}
                                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shrink-0">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                {service.name}
                                            </h3>
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium whitespace-nowrap">
                                                <CheckCircle2 className="w-3 h-3" />
                                                {service.available}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {service.description}
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{service.processingTime}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">What's Included:</h4>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Button */}
                                <button
                                    disabled={!service.available}
                                    onClick={() => handleServiceClick(service)}
                                    className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${service.available
                                            ? "bg-secondary text-white hover:bg-secondary/90 group-hover:shadow-lg group-hover:shadow-secondary/20 cursor-pointer"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    <span>{service.available ? "Start Application" : "Coming Soon"}</span>
                                    {service.available && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 border-t border-gray-100 py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Assistance?</h3>
                                <p className="text-gray-600 mb-4">
                                    Our support team is available to help you through the application process. We ensure all your documents are properly verified and processed.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href="/help"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Contact Support
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                    <a
                                        href="/faq"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        View FAQs
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
