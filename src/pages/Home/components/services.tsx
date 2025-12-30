import { Car, Building2, Heart, Store, GraduationCap, Trees, HardHat, Calendar } from "lucide-react"

const serviceCategories = [
    {
        id: 1,
        title: "Vehicle & Transportation",
        description: "Motor vehicle registration and transportation permits",
        icon: Car,
        services: ["Motor Vehicle Registration", "Commercial Vehicle Permit", "Motor-Park Operating Permit"],
        count: 3,
        color: "from-primary to-primary/60",
        textColor: "text-primary",
    },
    {
        id: 2,
        title: "Property & Land",
        description: "Property approvals, certificates, and land services",
        icon: Building2,
        services: ["Governor's Consent", "Building Plan Approval", "Occupancy Certificate", "Property Valuation Certificate"],
        count: 4,
        color: "from-secondary to-secondary/60",
        textColor: "text-secondary",
    },
    {
        id: 3,
        title: "Business & Trade",
        description: "Business licensing and commercial permits",
        icon: Store,
        services: ["Business License", "Food Establishment Permit", "Liquor License", "Market Stall Permit", "Street Trading Permit"],
        count: 5,
        color: "from-accent to-accent/60",
        textColor: "text-accent",
    },
    {
        id: 4,
        title: "Environmental & Resources",
        description: "Environmental permits and natural resource management",
        icon: Trees,
        services: ["Environmental Permit", "Quarry Permit", "Timber Permit", "Stone-Crushing Plant Permit", "Water Abstraction Permit"],
        count: 5,
        color: "from-primary/70 to-secondary/50",
        textColor: "text-primary",
    },
    {
        id: 5,
        title: "Health & Safety",
        description: "Health facility registration and safety certificates",
        icon: Heart,
        services: ["Health Facility Registration", "Pharmacy Registration", "Fire Safety Certificate", "Waste Collection Permit"],
        count: 4,
        color: "from-secondary/70 to-accent/50",
        textColor: "text-secondary",
    },
    {
        id: 6,
        title: "Education",
        description: "Private school registration and licensing",
        icon: GraduationCap,
        services: ["Private Schools Registration"],
        count: 1,
        color: "from-primary to-accent/60",
        textColor: "text-primary",
    },
    {
        id: 7,
        title: "Infrastructure & Construction",
        description: "Road works, construction permits, and contractor services",
        icon: HardHat,
        services: ["Road Excavation Permit", "Utility Road-Cut Permit", "Contractor Registration", "Industrial Permit"],
        count: 4,
        color: "from-accent/70 to-primary/50",
        textColor: "text-accent",
    },
    {
        id: 8,
        title: "Public Records & Events",
        description: "Vital records, advertising, and special event permits",
        icon: Calendar,
        services: ["Vital Records Registration", "Burial Permit", "Special Event Permit", "Outdoor Advertising Permit", "Signage & Vendor Permit"],
        count: 5,
        color: "from-secondary to-primary/60",
        textColor: "text-secondary",
    },
]

export default function Services() {
    return (
        <section className="py-24 bg-background relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-secondary to-accent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Services</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Choose from a variety of essential government services available through our portal
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {serviceCategories.map((category) => {
                        const Icon = category.icon
                        return (
                            <div
                                key={category.id}
                                className="group cursor-pointer"
                            >
                                {/* Modern minimalistic card */}
                                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                                    {/* Icon container */}
                                    <div className="mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                                            {category.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {category.description}
                                        </p>

                                        {/* Service count badge */}
                                        <div className="pt-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium">
                                                <span>{category.count}</span>
                                                <span className="text-gray-500">service{category.count > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtle hover indicator */}
                                    <div className="mt-6 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-sm text-primary font-medium flex items-center gap-1">
                                            Explore services
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* View All Services Button */}
                <div className="mt-12 text-center">
                    <a
                        href="/services"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-all duration-200 hover:shadow-lg hover:shadow-secondary/20 group"
                    >
                        View All Services
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}
