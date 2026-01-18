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
  url: string
  submenu?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  {
    name: "Motor Vehicle Services",
    url: "/services/motor-vehicle-registration",
    submenu: [
      { name: "New Vehicle Registration", href: "/services/new-vehicle-registration/verify-vin"},
      { name: "License Renewal", href: "/services/renewal-license"},
      { name: "Change of Ownership", href: "/services/change-ownership/enter-cert-no"},
      { name: "Certificate Migration", href: "/services/certificate-migration/enter-vin"},
      { name: "Vehicle Valuation and VAT", href: "/services/vehicle-valuation-vat"},
    ]
  },
  {
    name: "Lands and Housing Permits",
    url: "",
    submenu: [
      { name: "Governor's Consent", href: "/services/lands-housing/governors-consent" },
      { name: "Building Plan Approval", href: "/services/lands-housing/building-plan-approval" },
      { name: "Building Completion Certificate", href: "/services/lands-housing/completion-certificate" },
      { name: "Right-of-Way (ROW) Excavation Permit", href: "/services/lands-housing/row-excavation" }
    ]
  },
  {
    name: "Commercial, Business and Trading Permits",
    url: "",
    submenu: [
      { name: "Market Registration Permit", href: "/services/commercial/market-registration" },
      { name: "Market Stall Permit", href: "/services/commercial/market-stall" },
      { name: "Street Trading / Hawking Permit", href: "/services/commercial/street-trading" },
      { name: "Signage & Roadside Vendor Permit", href: "/services/commercial/signage-vendor" },
      { name: "Shops and Supermarket Permits", href: "/services/commercial/shops-supermarket" },
      { name: "Outdoor Advertising", href: "/services/commercial/outdoor-advertising" }
    ]
  },
  {
    name: "Public Transportation Permits",
    url: "",
    submenu: [
      { name: "Motor Parks License", href: "/services/transportation/motor-parks" },
      { name: "Passenger Vehicle Permit", href: "/services/transportation/passenger-vehicle" }
    ]
  },
  {
    name: "Restaurants, Hotels and Bakeries",
    url: "",
    submenu: [
      { name: "Restaurant Permits", href: "/services/hospitality/restaurant" },
      { name: "Hotels License", href: "/services/hospitality/hotels" },
      { name: "Bakeries and Food Packaging", href: "/services/hospitality/bakeries" }
    ]
  },
  {
    name: "Registration of Births, Deaths and Marriages",
    url: "",
    submenu: [
      { name: "Birth Certificate/Registration", href: "/services/vital-records/birth-certificate" },
      { name: "Death Certificate", href: "/services/vital-records/death-certificate" },
      { name: "Marriage License", href: "/services/vital-records/marriage-license" },
      { name: "Cemetery Permits", href: "/services/vital-records/cemetery-permits" }
    ]
  },
  {
    name: "Education - Private Schools Licenses",
    url: "",
    submenu: [
      { name: "Creche", href: "/services/education/creche" },
      { name: "Primary", href: "/services/education/primary" },
      { name: "Secondary", href: "/services/education/secondary" },
      { name: "Vocational", href: "/services/education/vocational" }
    ]
  },
  {
    name: "Health - Health Facility Licenses",
    url: "",
    submenu: [
      { name: "Pharmacy", href: "/services/health/pharmacy" },
      { name: "Clinic/Hospital", href: "/services/health/clinic-hospital" },
      { name: "Maternity Homes", href: "/services/health/maternity-homes" },
      { name: "Medical", href: "/services/health/medical" }
    ]
  }
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="w-full bg-white text-black shadow-sm relative z-50">
      <nav className="container relative mx-auto flex items-center justify-between h-16">
        <Link to={'/'} className="text-xl font-bold flex items-center">
          <img src={logo} alt="Jigawa State Logo" className="rounded-full w-20" />
          <div className="text-lg uppercase">
            <p>Jigawa State</p>
            <p className="font-medium text-sm text-green-600">Public Access to Land Services (PALS)</p>
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

      {/* Desktop Dropdown Menu - Categorized Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((category, index) => (
              <div key={index} className="space-y-3">
                <Link to={category.url} className={`font-semibold text-sm text-green-700 uppercase tracking-wide border-b border-secondary/20 ${category.url === "" ? "pointer-events-none" : ""}`}>
                  {category.name}
                </Link>
                <div className="space-y-2">
                  {category.submenu?.map((item, subIndex) => (
                    <a
                      key={subIndex}
                      href={item.href}
                      className="block py-2 text-sm text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-md transition-all duration-200"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
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
          <div className="space-y-6">
            {menuItems.map((category, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-sm text-secondary uppercase tracking-wide border-b border-secondary/20 pb-2">
                  {category.name}
                </h3>
                <div className="space-y-1 pl-2">
                  {category.submenu?.map((item, subIndex) => (
                    <a
                      key={subIndex}
                      href={item.href}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-md transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
