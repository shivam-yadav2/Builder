import { useState, useEffect } from "react";
import {
  Menu,
  Home,
  Info,
  Building,
  Image,
  Phone,
  ChevronRight,
  Sparkles,
  HardHat,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import ConstructionEnquiry from "@/utils/ButtonCustom";

const navigationItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/about", label: "About Us", icon: Info },
  { path: "/property", label: "Property", icon: Building },
  { path: "/projects", label: "Our Projects", icon: HardHat },
  { path: "/gallery", label: "Sold Properties", icon: Image },
  { path: "/contact", label: "Contact Us", icon: Phone },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#004e2e]/95 shadow-lg backdrop-blur-md"
          : "bg-[#004e2e]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:h-20 lg:px-6">
        {/* Logo */}
        <NavLink to="/" className="flex shrink-0 items-center">
          <img
            src="/assets/logo/logo.png"
            alt="RSUS B2S Builders & Construction"
            className="h-11 w-auto object-contain sm:h-12 lg:h-14"
          />
        </NavLink>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 xl:flex">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#004e2e] shadow-sm"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden xl:block">
            <ConstructionEnquiry title="Construction Services" />
          </div>

          {/* Mobile / tablet menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="xl:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20">
                <Menu className="h-6 w-6" />
              </div>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[80vw] max-w-xs border-l-0 bg-[#004e2e] p-0 text-white"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b border-white/10 px-6 pb-5 pt-8 text-center">
                  <img
                    src="/assets/logo/logo.png"
                    alt="Logo"
                    className="mx-auto h-14 w-auto object-contain"
                  />
                  <div className="mx-auto mt-4 flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-[11px] font-medium text-amber-200">
                    <Sparkles className="h-3 w-3" />
                    Free Property Consultation
                  </div>
                </div>

                {/* Links */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                          isActive
                            ? "bg-white text-[#004e2e] shadow"
                            : "text-white/90 hover:bg-white/10"
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
                    </NavLink>
                  ))}
                </nav>

                {/* Footer CTA */}
                <div className="border-t border-white/10 p-5">
                  <p className="mb-3 text-center text-sm text-white/70">
                    Ready to start construction for your home?
                  </p>
                  <div className="flex justify-center">
                    <ConstructionEnquiry title="Get Started Now" theme={"white"} />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
