import { Car, Building2, Heart, Store, GraduationCap, Trees, HardHat, Calendar, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import back from "@/assets/watermarked_preview.gif";


const allServices = [
    { name: "Motor Vehicle Registration", href: "/services/motor-vehicle-registration", available: true, category: "Vehicle & Transportation" },
    { name: "Governor's Consent", href: "/services/governors-consent", available: false, category: "Property & Land" },
    { name: "Building Plan Approval", href: "/services/building-plan-approval", available: false, category: "Property & Land" },
    { name: "Occupancy Certificate", href: "/services/occupancy-certificate", available: false, category: "Property & Land" },
    { name: "Environmental Permit", href: "/services/environmental-permit", available: false, category: "Environmental & Resources" },
    { name: "Business License", href: "/services/business-license", available: false, category: "Business & Trade" },
    { name: "Food Establishment Permit", href: "/services/food-establishment-permit", available: false, category: "Business & Trade" },
    { name: "Fire Safety Certificate", href: "/services/fire-safety-certificate", available: false, category: "Health & Safety" },
    { name: "Liquor License", href: "/services/liquor-license", available: false, category: "Business & Trade" },
    { name: "Quarry Permit", href: "/services/quarry-permit", available: false, category: "Environmental & Resources" },
    { name: "Road Excavation Permit", href: "/services/road-excavation-permit", available: false, category: "Infrastructure & Construction" },
    { name: "Outdoor Advertising Permit", href: "/services/outdoor-advertising-permit", available: false, category: "Public Records & Events" },
    { name: "Market Stall Permit", href: "/services/market-stall-permit", available: false, category: "Business & Trade" },
    { name: "Motor-Park Operating Permit", href: "/services/motor-park-permit", available: false, category: "Vehicle & Transportation" },
    { name: "Commercial Vehicle Permit", href: "/services/commercial-vehicle-permit", available: false, category: "Vehicle & Transportation" },
    { name: "Health Facility Registration", href: "/services/health-facility-registration", available: false, category: "Health & Safety" },
    { name: "Private Schools Registration", href: "/services/private-schools-registration", available: false, category: "Education" },
    { name: "Pharmacy Registration", href: "/services/pharmacy-registration", available: false, category: "Health & Safety" },
    { name: "Waste Collection Permit", href: "/services/waste-collection-permit", available: false, category: "Environmental & Resources" },
    { name: "Street Trading Permit", href: "/services/street-trading-permit", available: false, category: "Business & Trade" },
    { name: "Property Valuation Certificate", href: "/services/property-valuation-certificate", available: false, category: "Property & Land" },
    { name: "Special Event Permit", href: "/services/special-event-permit", available: false, category: "Public Records & Events" },
    { name: "Signage & Vendor Permit", href: "/services/signage-vendor-permit", available: false, category: "Public Records & Events" },
    { name: "Industrial Permit", href: "/services/industrial-permit", available: false, category: "Infrastructure & Construction" },
    { name: "Timber Permit", href: "/services/timber-permit", available: false, category: "Environmental & Resources" },
    { name: "Stone-Crushing Plant Permit", href: "/services/stone-crushing-permit", available: false, category: "Environmental & Resources" },
    { name: "Water Abstraction Permit", href: "/services/water-abstraction-permit", available: false, category: "Environmental & Resources" },
    { name: "Utility Road-Cut Permit", href: "/services/utility-road-cut-permit", available: false, category: "Infrastructure & Construction" },
    { name: "Quarry Rehabilitation Certificate", href: "/services/quarry-rehabilitation-certificate", available: false, category: "Environmental & Resources" },
    { name: "Contractor Registration", href: "/services/contractor-registration", available: false, category: "Infrastructure & Construction" },
    { name: "Burial Permit", href: "/services/burial-permit", available: false, category: "Public Records & Events" },
    { name: "Vital Records Registration", href: "/services/vital-records-registration", available: false, category: "Public Records & Events" },
]

const categories = [
    { name: "Vehicle & Transportation", icon: Car, color: "text-primary" },
    { name: "Property & Land", icon: Building2, color: "text-secondary" },
    { name: "Business & Trade", icon: Store, color: "text-accent" },
    { name: "Environmental & Resources", icon: Trees, color: "text-primary" },
    { name: "Health & Safety", icon: Heart, color: "text-secondary" },
    { name: "Education", icon: GraduationCap, color: "text-primary" },
    { name: "Infrastructure & Construction", icon: HardHat, color: "text-accent" },
    { name: "Public Records & Events", icon: Calendar, color: "text-secondary" },
]

export default function Services() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className=" h-[50vh] py-16 px-4 relative">
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
                                <div className="text-2xl font-bold text-gray-900">32</div>
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
                                <div className="text-2xl font-bold text-gray-900">1</div>
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
                                <div className="text-2xl font-bold text-gray-900">31</div>
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
                                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                                <span className="text-sm text-gray-500">({categoryServices.length} services)</span>
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
