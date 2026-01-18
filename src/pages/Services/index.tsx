import { Car, Building2, Heart, Store, GraduationCap, Clock, ArrowRight, CheckCircle2, Bus, ChefHat, FileText } from "lucide-react"
import back from "@/assets/watermarked_preview.gif";
import { Link } from "react-router-dom";

const allServices = [
    // Motor Vehicle Services
    { name: "New Vehicle Registration", href: "/services/new-vehicle-registration/verify-vin", available: true, category: "Motor Vehicle Services" },
    { name: "License Renewal", href: "/services/renewal-license", available: true, category: "Motor Vehicle Services" },
    { name: "Change of Ownership", href: "/services/change-ownership/enter-cert-no", available: true, category: "Motor Vehicle Services" },
    { name: "Certificate Migration", href: "/services/certificate-migration/enter-vin", available: true, category: "Motor Vehicle Services" },
    { name: "Vehicle Valuation and VAT", href: "/services/vehicle-valuation", available: true, category: "Motor Vehicle Services" },

    // Lands and Housing Permits
    { name: "Governor's Consent", href: "/services/governors-consent", available: false, category: "Lands and Housing Permits" },
    { name: "Building Plan Approval", href: "/services/building-plan-approval", available: false, category: "Lands and Housing Permits" },
    { name: "Building Completion Certificate", href: "/services/building-completion-certificate", available: false, category: "Lands and Housing Permits" },
    { name: "Right-of-Way (ROW) Excavation Permit", href: "/services/row-excavation-permit", available: false, category: "Lands and Housing Permits" },

    // Commercial, Business and Trading Permits
    { name: "Market Registration Permit", href: "/services/market-registration-permit", available: false, category: "Commercial, Business and Trading Permits" },
    { name: "Market Stall Permit", href: "/services/market-stall-permit", available: false, category: "Commercial, Business and Trading Permits" },
    { name: "Street Trading / Hawking Permit", href: "/services/street-trading-permit", available: false, category: "Commercial, Business and Trading Permits" },
    { name: "Signage & Roadside Vendor Permit", href: "/services/signage-vendor-permit", available: false, category: "Commercial, Business and Trading Permits" },
    { name: "Shops and Supermarket Permits", href: "/services/shops-supermarket-permits", available: false, category: "Commercial, Business and Trading Permits" },
    { name: "Outdoor Advertising", href: "/services/outdoor-advertising", available: false, category: "Commercial, Business and Trading Permits" },

    // Public Transportation Permits
    { name: "Motor Parks License", href: "/services/motor-parks-license", available: false, category: "Public Transportation Permits" },
    { name: "Passenger Vehicle Permit", href: "/services/passenger-vehicle-permit", available: false, category: "Public Transportation Permits" },

    // Restaurants, Hotels and Bakeries
    { name: "Restaurant Permits", href: "/services/restaurant-permits", available: false, category: "Restaurants, Hotels and Bakeries" },
    { name: "Hotels License", href: "/services/hotels-license", available: false, category: "Restaurants, Hotels and Bakeries" },
    { name: "Bakeries and Food Packaging", href: "/services/bakeries-food-packaging", available: false, category: "Restaurants, Hotels and Bakeries" },

    // Registration of Births, Deaths and Marriages
    { name: "Birth Certificate/Registration", href: "/services/birth-certificate", available: false, category: "Registration of Births, Deaths and Marriages" },
    { name: "Death Certificate", href: "/services/death-certificate", available: false, category: "Registration of Births, Deaths and Marriages" },
    { name: "Marriage License", href: "/services/marriage-license", available: false, category: "Registration of Births, Deaths and Marriages" },
    { name: "Cemetery Permits", href: "/services/cemetery-permits", available: false, category: "Registration of Births, Deaths and Marriages" },

    // Education - Private Schools Licenses
    { name: "Creche", href: "/services/creche-license", available: false, category: "Education - Private Schools Licenses" },
    { name: "Primary", href: "/services/primary-school-license", available: false, category: "Education - Private Schools Licenses" },
    { name: "Secondary", href: "/services/secondary-school-license", available: false, category: "Education - Private Schools Licenses" },
    { name: "Vocational", href: "/services/vocational-school-license", available: false, category: "Education - Private Schools Licenses" },

    // Health - Health Facility Licenses
    { name: "Pharmacy", href: "/services/pharmacy-license", available: false, category: "Health - Health Facility Licenses" },
    { name: "Clinic/Hospital", href: "/services/clinic-hospital-license", available: false, category: "Health - Health Facility Licenses" },
    { name: "Maternity Homes", href: "/services/maternity-homes-license", available: false, category: "Health - Health Facility Licenses" },
    { name: "Medical", href: "/services/medical-license", available: false, category: "Health - Health Facility Licenses" },
]

const categories = [
    { url: 'motor-vehicle-registration', name: "Motor Vehicle Services", icon: Car, color: "text-primary" },
    { url: '', name: "Lands and Housing Permits", icon: Building2, color: "text-secondary" },
    { url: '', name: "Commercial, Business and Trading Permits", icon: Store, color: "text-accent" },
    { url: '', name: "Public Transportation Permits", icon: Bus, color: "text-primary" },
    { url: '', name: "Restaurants, Hotels and Bakeries", icon: ChefHat, color: "text-secondary" },
    { url: '', name: "Registration of Births, Deaths and Marriages", icon: FileText, color: "text-accent" },
    { url: '', name: "Education - Private Schools Licenses", icon: GraduationCap, color: "text-primary" },
    { url: '', name: "Health - Health Facility Licenses", icon: Heart, color: "text-secondary" },
]

export default function Services() {
    const totalServices = allServices.length
    const availableServices = allServices.filter(s => s.available).length
    const comingSoonServices = totalServices - availableServices

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className=" h-[50vh] py-16 px-4 relative bg-black/60 flex items-center">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        All Services
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl">
                        Browse all available government services. We're continuously expanding our digital offerings to serve you better.
                    </p>
                </div>

                <div className="absolute inset-0 -z-10">
                    <img
                        src={back}
                        alt="Skyscraper background"
                        loading="lazy"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-4 py-12">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalServices}</div>
                                <div className="text-sm text-gray-600">Total Services</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{availableServices}</div>
                                <div className="text-sm text-gray-600">Available Now</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{comingSoonServices}</div>
                                <div className="text-sm text-gray-600">Coming Soon</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services by Category */}
                {categories.map((category) => {
                    const Icon = category.icon
                    const categoryServices = allServices.filter(s => s.category === category.name)

                    if (categoryServices.length === 0) return null

                    return (
                        <div key={category.name} className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${category.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <Link to={category.url} className={`text-2xl font-bold text-gray-900 hover:underline ${category.url === "" ? "pointer-events-none" : ""}`}>{category.name}</Link>
                                <span className="text-sm text-gray-500">({categoryServices.length} services)</span>
                                {category.url === "" && (<span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">Coming Soon</span>)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryServices.map((service) => (
                                    <div
                                        key={service.name}
                                        className={`bg-white rounded-lg p-6 border border-gray-100 transition-all duration-200 ${service.available
                                            ? 'hover:border-primary hover:shadow-lg hover:shadow-primary/5 cursor-pointer'
                                            : 'opacity-75'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                {service.available ? (
                                                    <a href={service.href} className="block group">
                                                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                            {service.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                                            <span>Access Service</span>
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <>
                                                        <h3 className="font-semibold text-gray-900 mb-2">
                                                            {service.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                            <Clock className="w-4 h-4" />
                                                            <span>Coming Soon</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            {service.available && (
                                                <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
