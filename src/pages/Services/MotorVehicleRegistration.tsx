import { Car, FileText, RefreshCw, Users, DollarSign, Clock, CheckCircle2, ArrowRight, Shield, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"

const motorVehicleServices = [
    {
        id: 1,
        name: "New Vehicle Registration",
        description: "Register a vehicle to obtain new Jigawa licensing documents and plates",
        icon: Car,
        features: [
            "Easy online application",
            "Online document and vehicle verification",
            "License and ownership certificate",
            "Online fee payment"
        ],
        processingTime: "1-3 business days",
        category: "Initial Registration",
        available: true
    },
    {
        id: 2,
        name: "License Renewal",
        description: "Renew your existing Jigawa state vehicle license documents to keep your registration current for another year.",
        icon: RefreshCw,
        features: [
            "Quick renewal process",
            "Digital license",
            "Online fee payment"
        ],
        processingTime: "1 business day",
        category: "Renewal Services",
        available: true
    },
    {
        id: 3,
        name: "Change of Ownership",
        description: "Use this to start the process of getting a Proof of Ownership Certificate for a new owner upon a vehicle sale or transfer.",
        icon: Users,
        features: [
            "Vehicle and ownership verification",
            "Fraud protection",
            "Online fee payment",
            "New digital ownership certificate"
        ],
        processingTime: "1-2 business days",
        category: "Transfer Services",
        available: true
    },
    {
        id: 4,
        name: "Certificate Migration",
        description: "This option is for converting your current (existing) Proof of Ownership Certificate to the new digital certificate.",
        icon: FileText,
        features: [
            "Inter-state verification",
            "Online vehicle and ownership document verification",
            "Online fee payment",
            "New digital ownership certificate"
        ],
        processingTime: "1-2 business days",
        category: "Migration Services",
        available: true
    },
    {
        id: 5,
        name: "Vehicle Valuation & VAT",
        description: "Get professional vehicle valuation for tax purposes and VAT assessment services. NRS approved vehicle valuation for tax (VAT) calculation. Improper calculation and payment of VAT could result in problems during ownership change and licensing",
        icon: DollarSign,
        features: [
            "Professional assessment",
            "Offical valuation report",
            "VAT calculation",
            "Multiple VAT payment options"
        ],
        processingTime: "1-2 business days",
        category: "Assessment Services",
        available: true
    }
]

export default function MotorVehicleRegistration() {
    const navigate = useNavigate()

    const handleServiceClick = (service: typeof motorVehicleServices[0]) => {
        if (!service.available) return

        if (service.id === 1) {
            // New Vehicle Registration
            navigate("/services/new-vehicle-registration/verify-vin")
        } else if (service.id === 2) {
            // License Renewal
            navigate("/services/renewal-license")
        } else if (service.id === 4) {
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
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Motor Vehicle Services
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl">
                        Online application and licensing documents delivery for new registrations, renewals, and owenership transfers. Fast, secure, and fully digital.
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
                                <div className="text-2xl font-bold text-gray-900">1-3</div>
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
                    <p className="text-gray-600">Choose a service and start your application</p>
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
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Features:</h4>
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
