import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Heart, ArrowUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Properties', path: '/property' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const services = [
    'Property Consultation',
    'Construction Services',
    'Real Estate Investment',
    'Property Management',
    'Legal Assistance'
  ];

  return (
    <footer className="bg-gradient-to-br from-[#004e2e] via-[#005a35] to-[#003422] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 right-40 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/logo/logo.png"
                alt="PropExpert Logo"
                className=""
              />
              
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
               Trust us to handle your real estate needs.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></div>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2"
                  >
                    <div className="w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full mr-3"></div>
              Our Services
            </h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <div className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 cursor-pointer">
                    <div className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="group-hover:translate-x-1 transition-transform text-sm">{service}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-600 rounded-full mr-3"></div>
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-xs text-gray-400">Lucknow, Uttar Pradesh</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-xs text-gray-400">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-gray-400">info@propexpert.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>© {currentYear} PropExpert. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>in India. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <button
              onClick={scrollToTop}
              className="group p-2 bg-gradient-to-r from-[#004e2e] to-[#006b3f] hover:from-[#006b3f] hover:to-[#008751] rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;