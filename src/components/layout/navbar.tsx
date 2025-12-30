import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@/assets/jigawa-logo.png"
import { Link } from "react-router-dom"

interface SubMenuItem {
  name: string
  href: string
}

interface MenuItem {
  name: string
  href?: string
  submenu?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  {
    name: "Motor Vehicle Registration",
    href: "/services/motor-vehicle-registration"
  },
  {
    name: "Governor's Consent",
    href: "/services/governors-consent"
  },
  {
    name: "Building Plan Approval",
    href: "/services/building-plan-approval"
  },
  {
    name: "Occupancy Certificate",
    href: "/services/occupancy-certificate"
  },
  {
    name: "Environmental Permit",
    href: "/services/environmental-permit"
  },
  {
    name: "Business License",
    href: "/services/business-license"
  },
  {
    name: "Food Establishment Permit",
    href: "/services/food-establishment-permit"
  },
  {
    name: "Fire Safety Certificate",
    href: "/services/fire-safety-certificate"
  },
  {
    name: "Liquor License",
    href: "/services/liquor-license"
  },
  {
    name: "Quarry Permit",
    href: "/services/quarry-permit"
  },
  {
    name: "Road Excavation Permit",
    href: "/services/road-excavation-permit"
  },
  {
    name: "Outdoor Advertising Permit",
    href: "/services/outdoor-advertising-permit"
  },
  {
    name: "Market Stall Permit",
    href: "/services/market-stall-permit"
  },
  {
    name: "Motor-Park Operating Permit",
    href: "/services/motor-park-permit"
  },
  {
    name: "Commercial Vehicle Permit",
    href: "/services/commercial-vehicle-permit"
  },
  {
    name: "Health Facility Registration",
    href: "/services/health-facility-registration"
  },
  {
    name: "Private Schools Registration",
    href: "/services/private-schools-registration"
  },
  {
    name: "Pharmacy Registration",
    href: "/services/pharmacy-registration"
  },
  {
    name: "Waste Collection Permit",
    href: "/services/waste-collection-permit"
  },
  {
    name: "Street Trading Permit",
    href: "/services/street-trading-permit"
  },
  {
    name: "Property Valuation Certificate",
    href: "/services/property-valuation-certificate"
  },
  {
    name: "Special Event Permit",
    href: "/services/special-event-permit"
  },
  {
    name: "Signage & Vendor Permit",
    href: "/services/signage-vendor-permit"
  },
  {
    name: "Industrial Permit",
    href: "/services/industrial-permit"
  },
  {
    name: "Timber Permit",
    href: "/services/timber-permit"
  },
  {
    name: "Stone-Crushing Plant Permit",
    href: "/services/stone-crushing-permit"
  },
  {
    name: "Water Abstraction Permit",
    href: "/services/water-abstraction-permit"
  },
  {
    name: "Utility Road-Cut Permit",
    href: "/services/utility-road-cut-permit"
  },
  {
    name: "Quarry Rehabilitation Certificate",
    href: "/services/quarry-rehabilitation-certificate"
  },
  {
    name: "Contractor Registration",
    href: "/services/contractor-registration"
  },
  {
    name: "Burial Permit",
    href: "/services/burial-permit"
  },
  {
    name: "Vital Records Registration",
    href: "/services/vital-records-registration"
  },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="w-full bg-white text-black shadow-sm relative z-50">
      <nav className="container relative mx-auto flex items-center justify-between h-16">
        <Link to={'/'} className="text-xl font-bold flex items-center">
          <img src={logo} alt="Jigawa State Logo" className="rounded-full w-16" />
          <div className="text-sm uppercase">
            <p>Jigawa State</p>
            <p className="font-medium text-xs text-green-600">Public Access to Land Services (PALS)</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div
          className="hidden md:flex h-full bg-secondary p-0 items-center px-4"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <button className="flex items-center gap-2 transition-colors duration-200 bg-secondary text-white ">
            <span className="font-medium uppercase">Services</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isMenuOpen && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center gap-2 hover:text-accent transition-colors duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Desktop Dropdown Menu - Full Width Grid */}
      <div
        className={cn(
          "w-full transition-all duration-300 ease-out absolute left-0 z-40 bg-background shadow-lg border-t border-border",
          isMenuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        )}
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div className="container mx-auto py-8 px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-secondary/20"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-background border-t border-border shadow-lg transition-all duration-300 ease-out overflow-hidden absolute left-0 w-full z-40",
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-secondary/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}