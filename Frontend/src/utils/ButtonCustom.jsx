import React, { useState, useEffect } from 'react';
import { MoveRight, X, MapPin, Home, Calculator, User, Phone, Sparkles, Star, Building, Zap } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ButtonCustom = ({ title, onClick, theme }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden ${
        theme === "white" ? "text-[#001324]" : "text-white"
      } w-fit font-bold truncate cursor-pointer px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl`}
      style={{
        background: theme === "white" 
          ? 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #ffffff 100%)' 
          : 'linear-gradient(135deg, #015231 0%, #006b3f 50%, #008751 100%)',
        boxShadow: theme === "white"
          ? '0 4px 15px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
          : '0 4px 20px rgba(0, 78, 46, 0.3), 0 2px 8px rgba(0, 78, 46, 0.2)'
      }}
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      {/* Floating sparkles */}
      <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
      </div>
      
      <div className="relative flex items-center gap-3">
        <span className="font-semibold tracking-wide">{title}</span>
        <div className="p-1 bg-white/20 rounded-full group-hover:rotate-45 transition-transform duration-300">
          <MoveRight className="w-4 h-4" />
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

const EnquiryModal = ({ isOpen, onClose, theme = "dark" }) => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    location: '',
    plotArea: '',
    constructionArea: '',
    budget: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Block/unblock body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Block scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Cleanup function
      return () => {
        // Restore scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.number.trim()) newErrors.number = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.plotArea || formData.plotArea <= 0) newErrors.plotArea = 'Valid plot area is required';
    if (!formData.constructionArea || formData.constructionArea <= 0) newErrors.constructionArea = 'Valid construction area is required';
    if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required';
    
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.number && !phoneRegex.test(formData.number.replace(/\s/g, ''))) {
      newErrors.number = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('https://backend.rsusb2sbuildersconstructions.com/api/v1/constructionFilter/add', {
        name: formData.name,
        number: formData.number,
        location: formData.location,
        plotArea: parseFloat(formData.plotArea),
        constructionArea: parseFloat(formData.constructionArea),
        budget: parseFloat(formData.budget)
      });
      
      if (response.status === 200 || response.status === 201) {
        toast.success('🎉 Enquiry submitted successfully! We will contact you soon.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(135deg, #004e2e 0%, #006b3f 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(0, 78, 46, 0.3)'
          }
        });
        
        // Reset form and close modal
        setFormData({
          name: '',
          number: '',
          location: '',
          plotArea: '',
          constructionArea: '',
          budget: ''
        });
        onClose();
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || '❌ Something went wrong. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 right-40 w-16 h-16 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Toaster />
      
      {/* Main modal container with enhanced scrolling */}
      <div className={`relative w-full max-w-lg mx-auto max-h-[95vh] ${
        theme === "white" ? "bg-white text-[#001324]" : "bg-gradient-to-br from-[#001324] via-[#002244] to-[#001324] text-white"
      } rounded-3xl shadow-2xl overflow-hidden border border-white/10`}>
        
        {/* Sticky Header with enhanced design */}
        <div className={`sticky top-0 z-10 ${
          theme === "white" 
            ? "bg-white/95 backdrop-blur-sm border-b border-gray-200" 
            : "bg-gradient-to-r from-[#001324]/95 via-[#004e2e]/95 to-[#001324]/95 backdrop-blur-sm border-b border-white/10"
        } p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-[#004e2e] to-[#006b3f] rounded-2xl shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#004e2e] to-[#006b3f] bg-clip-text text-transparent">
                  Construction Enquiry
                </h2>
                <p className="text-sm text-gray-500">Get your dream project started</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`group p-3 ${
                theme === "white" 
                  ? "hover:bg-gray-100 text-gray-600" 
                  : "hover:bg-white/10 text-white"
              } rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4 hidden lg:flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-gray-500">Free consultation • Expert guidance • Quick response</span>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-140px)] custom-scrollbar">
          <div className="p-3 lg:p-6 space-y-6 ">
            
            {/* Personal Information Section */}
            <div className="space-y-4">
              
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 lg:py-4 pl-12 rounded-2xl border-2 transition-all duration-300 ${
                        errors.name 
                          ? 'border-red-400 shadow-red-100' 
                          : 'border-gray-200 focus:border-[#004e2e] hover:border-gray-300'
                      } ${
                        theme === "white" 
                          ? "bg-gray-50 text-[#001324] focus:bg-white" 
                          : "bg-white/5 text-white focus:bg-white/10 backdrop-blur-sm"
                      } focus:outline-none focus:ring-4 focus:ring-[#004e2e]/20 focus:scale-[1.02]`}
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#004e2e] transition-colors" />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center space-x-1 animate-shake">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 lg:py-4 pl-12 rounded-2xl border-2 transition-all duration-300 ${
                        errors.number 
                          ? 'border-red-400 shadow-red-100' 
                          : 'border-gray-200 focus:border-[#004e2e] hover:border-gray-300'
                      } ${
                        theme === "white" 
                          ? "bg-gray-50 text-[#001324] focus:bg-white" 
                          : "bg-white/5 text-white focus:bg-white/10 backdrop-blur-sm"
                      } focus:outline-none focus:ring-4 focus:ring-[#004e2e]/20 focus:scale-[1.02]`}
                      placeholder="Enter your phone number"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#004e2e] transition-colors" />
                  </div>
                  {errors.number && (
                    <p className="text-red-500 text-sm mt-2 flex items-center space-x-1 animate-shake">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      <span>{errors.number}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Details Section */}
            <div className="space-y-4">
              
              
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 lg:py-4 pl-12 rounded-2xl border-2 transition-all duration-300 ${
                      errors.location 
                        ? 'border-red-400 shadow-red-100' 
                        : 'border-gray-200 focus:border-[#004e2e] hover:border-gray-300'
                    } ${
                      theme === "white" 
                        ? "bg-gray-50 text-[#001324] focus:bg-white" 
                        : "bg-white/5 text-white focus:bg-white/10 backdrop-blur-sm"
                    } focus:outline-none focus:ring-4 focus:ring-[#004e2e]/20 focus:scale-[1.02]`}
                    placeholder="Enter project location"
                  />
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#004e2e] transition-colors" />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1 animate-shake">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Plot Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    name="plotArea"
                    value={formData.plotArea}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 lg:py-4 rounded-2xl border-2 transition-all duration-300 ${
                      errors.plotArea 
                        ? 'border-red-400 shadow-red-100' 
                        : 'border-gray-200 focus:border-[#004e2e] hover:border-gray-300'
                    } ${
                      theme === "white" 
                        ? "bg-gray-50 text-[#001324] focus:bg-white" 
                        : "bg-white/5 text-white focus:bg-white/10 backdrop-blur-sm"
                    } focus:outline-none focus:ring-4 focus:ring-[#004e2e]/20 focus:scale-[1.02]`}
                    placeholder="0"
                    min="1"
                  />
                  {errors.plotArea && (
                    <p className="text-red-500 text-sm mt-2 flex items-center space-x-1 animate-shake">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      <span>{errors.plotArea}</span>
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Construction Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    name="constructionArea"
                    value={formData.constructionArea}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 lg:py-4 rounded-2xl border-2 transition-all duration-300 ${
                      errors.constructionArea 
                        ? 'border-red-400 shadow-red-100' 
                        : 'border-gray-200 focus:border-[#004e2e] hover:border-gray-300'
                    } ${
                      theme === "white" 
                        ? "bg-gray-50 text-[#001324] focus:bg-white" 
                        : "bg-white/5 text-white focus:bg-white/10 backdrop-blur-sm"
                    } focus:outline-none focus:ring-4 focus:ring-[#004e2e]/20 focus:scale-[1.02]`}
                    placeholder="0"
                    min="1"
                  />
                  {errors.constructionArea && (
                    <p className="text-red-500 text-sm mt-2 flex items-center space-x-1 animate-shake">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      <span>{errors.constructionArea}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Budget (₹) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 lg:py-4 pl-12 rounded-2xl border-2 transition-all duration-300 ${
                      errors.budget 
                        ? 'border-red-400 shadow-red-100' 
                        : 'border-gray-200 focus:border-[#004e2e] hover:border-gray-300'
                    } ${
                      theme === "white" 
                        ? "bg-gray-50 text-[#001324] focus:bg-white" 
                        : "bg-white/5 text-white focus:bg-white/10 backdrop-blur-sm"
                    } focus:outline-none focus:ring-4 focus:ring-[#004e2e]/20 focus:scale-[1.02]`}
                    placeholder="Enter your budget"
                    min="1"
                  />
                  <Calculator className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#004e2e] transition-colors" />
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1 animate-shake">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.budget}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer with enhanced action buttons */}
        <div className={`sticky bottom-0 ${
          theme === "white" 
            ? "bg-white/95 backdrop-blur-sm border-t border-gray-200" 
            : "bg-gradient-to-r from-[#001324]/95 via-[#004e2e]/95 to-[#001324]/95 backdrop-blur-sm border-t border-white/10"
        } p-6`}>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-3 lg:px-6 py-2 lg:py-4 rounded-2xl border-2 font-semibold transition-all duration-300 hover:scale-[1.02] ${
                theme === "white"
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  : "border-white/20 text-white hover:bg-white/10 hover:border-white/40"
              }`}
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`group flex-1 px-3 lg:px-6 py-2 lg:py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] ${
                isSubmitting 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:shadow-2xl active:scale-95'
              }`}
              style={{
                background: 'linear-gradient(135deg, #004e2e 0%, #006b3f 50%, #008751 100%)',
                boxShadow: '0 8px 25px rgba(0, 78, 46, 0.3), 0 3px 10px rgba(0, 78, 46, 0.2)'
              }}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
              
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white">Submitting...</span>
                </>
              ) : (
                <>
                  
                  <span className="text-white">Submit Enquiry</span>
                  
                </>
              )}
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #004e2e, #006b3f);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #006b3f, #008751);
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
};

// Enhanced main component
const ConstructionEnquiry = ({ title = "Get Free Quote", theme = "white" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      <ButtonCustom
        title={title}
        onClick={() => setIsModalOpen(true)}
        theme={theme}
      />

      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        theme={theme}
      />
    </div>
  );
};

export default ConstructionEnquiry;