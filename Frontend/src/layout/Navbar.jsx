import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  Building,
  Image,
  Phone,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import ConstructionEnquiry from "@/utils/ButtonCustom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items with icons
  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About Us", icon: Info },
    { path: "/property", label: "Property", icon: Building },
    { path: "/gallery", label: "Gallery", icon: Image },
    { path: "/contact", label: "Contact Us", icon: Phone },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-[#004e2e]/95 backdrop-blur-lg shadow-2xl border-b border-white/10"
          : "bg-[#004e2e] shadow-md"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#004e2e] via-[#005a35] to-[#004e2e] opacity-90"></div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-green-400/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-4 right-20 w-16 h-16 bg-white/5 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-2 right-40 w-20 h-20 bg-green-300/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative container mx-auto grid grid-cols-2 lg:grid-cols-5 p-3 lg:p-4">
        {/* Enhanced Logo Section */}
        <NavLink
          to="/"
          className="group flex items-center space-x-3 text-2xl text-white font-bold transition-all duration-300"
        >
          <div className="relative">
            <img
              src="/assets/logo/logo.png"
              alt="Logo"
              className="  transition-all h-[80px] duration-300 "
            />
            {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div> */}
          </div>
        </NavLink>

        {/* Enhanced Desktop Navigation */}
        <ul className="hidden col-span-3 lg:flex justify-center items-center space-x-1 xl:space-x-3">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="relative group">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center space-x-2 px-3 py-2 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 overflow-hidden ${
                      isActive
                        ? "text-[#004e2e] bg-white shadow-lg scale-105"
                        : "text-white hover:text-white hover:bg-white/15 hover:shadow-lg hover:scale-105"
                    }`
                  }
                >
                  {/* Background shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                  <IconComponent className="h-4 w-4 xl:h-5 xl:w-5 relative z-10" />
                  <span className="relative z-10 hidden xl:inline">
                    {item.label}
                  </span>
                  <span className="relative z-10 xl:hidden">
                    {item.label.split(" ")[0]}
                  </span>

                  {/* Active indicator */}
                  <div
                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 ${
                      window.location.pathname === item.path
                        ? "w-full"
                        : "group-hover:w-full"
                    }`}
                  ></div>
                </NavLink>

                {/* Tooltip for smaller screens */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none xl:hidden">
                  {item.label}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Enhanced Action Section */}
        <div className="flex items-center justify-end space-x-3">
          {/* Enhanced CTA Button */}
          <div className="hidden lg:block group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <ConstructionEnquiry title="Build Your  Home" />
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Menu Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden relative group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <Menu
                  className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                />
              </div>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-80 p-0 bg-gradient-to-br from-[#004e2e] via-[#005a35] to-[#003422] border-r-0"
            >
              <div className=" overflow-y-scroll">
                {/* Mobile Header Section */}
                <div className="relative p-6 border-b border-white/10  bg-gradient-to-r from-black/20 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src="/assets/logo/logo.png"
                          alt="Logo"
                          className="w-14 h-14 rounded-full border-2 border-white/30 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-xl bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                          RSUS.B2S
                        </h2>
                        <p className="text-green-200 text-sm">
                          Your Property Partner
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 p-2 h-auto rounded-full transition-all duration-200 hover:rotate-90 hover:scale-110"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Special Offer */}
                  <div className="mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 text-amber-200 px-4 py-2 rounded-full text-sm">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span className="font-semibold">
                      Free Property Consultation
                    </span>
                  </div>
                </div>

                {/* Mobile Navigation Section */}
                <div className="flex-1 p-6">
                  <div className="space-y-3">
                    {navigationItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <div
                          key={item.path}
                          className="transform transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            animation: `slideInFromLeft 0.4s ease-out ${index * 0.1}s both`,
                          }}
                        >
                          <NavLink
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                              `group relative flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 overflow-hidden ${
                                isActive
                                  ? "bg-white text-[#004e2e] shadow-xl scale-[1.02] border-2 border-green-400/50"
                                  : "text-white hover:bg-white/15 hover:shadow-lg hover:translate-x-1 border-2 border-transparent"
                              }`
                            }
                          >
                            {/* Background Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                            <div className="relative flex items-center space-x-4">
                              <div
                                className={`p-3 rounded-lg transition-all duration-300 ${
                                  window.location.pathname === item.path
                                    ? "bg-[#004e2e]/20 shadow-inner"
                                    : "bg-white/10 group-hover:bg-white/20 group-hover:shadow-lg"
                                }`}
                              >
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div>
                                <span className="font-semibold text-lg block">
                                  {item.label}
                                </span>
                                <span className="text-xs opacity-70">
                                  Explore {item.label.toLowerCase()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {window.location.pathname === item.path && (
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              )}
                              <ChevronRight
                                className={`h-5 w-5 transition-all duration-300 ${
                                  window.location.pathname === item.path
                                    ? "opacity-100 translate-x-0 text-green-600"
                                    : "opacity-50 group-hover:opacity-100 group-hover:translate-x-1"
                                }`}
                              />
                            </div>
                          </NavLink>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Action Section */}
                <div className="p-6 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent">
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-white font-semibold text-lg">
                        Ready to get started?
                      </p>
                      <p className="text-green-200 text-sm">
                        Let's find your perfect property solution
                      </p>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative">
                        <ConstructionEnquiry
                          title="Get Started Now"
                          theme={"white"}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Decorative Elements */}
                <div className="absolute top-32 right-8 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
                <div
                  className="absolute bottom-40 left-8 w-16 h-16 bg-green-400/10 rounded-full blur-lg animate-bounce"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-64 right-16 w-12 h-12 bg-amber-400/10 rounded-full blur-md animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>

                {/* CSS for animations */}
                <style jsx>{`
                  @keyframes slideInFromLeft {
                    from {
                      opacity: 0;
                      transform: translateX(-30px);
                    }
                    to {
                      opacity: 1;
                      transform: translateX(0);
                    }
                  }

                  @keyframes float {
                    0%,
                    100% {
                      transform: translateY(0px);
                    }
                    50% {
                      transform: translateY(-10px);
                    }
                  }
                `}</style>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
