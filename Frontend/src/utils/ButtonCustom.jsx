import React, { useState } from 'react';
import { MoveRight, X, MapPin, Home, Calculator, User, Phone } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ButtonCustom = ({ title, onClick, theme }) => {
  return (
    <div
      onClick={onClick}
      className={`flex ${
        theme == "white" ? "text-[#001324]" : "text-black"
      } w-fit font-semibold truncate items-center gap-3 cursor-pointer px-5 py-2 rounded-3xl ${
        theme == "white" ? "bg-white" : "bg-white"
      }`}
    >
      <p>{title}</p>
      <p>
        <MoveRight />
      </p>
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
      const response = await axios.post('http://localhost:4000/api/v1/constructionFilter/add', {
        name: formData.name,
        number: formData.number,
        location: formData.location,
        plotArea: parseFloat(formData.plotArea),
        constructionArea: parseFloat(formData.constructionArea),
        budget: parseFloat(formData.budget)
      });
      
      if (response.status === 200 || response.status === 201) {
        toast.success('Enquiry submitted successfully! We will contact you soon.', {
          duration: 4000,
          position: 'top-right'
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
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.', {
        duration: 4000,
        position: 'top-right'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Toaster />
      <div className={`${
        theme === "white" ? "bg-white text-[#001324]" : "bg-[#001324] text-white"
      } rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Construction Enquiry</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          
          {/* Personal Information */}
          <div className="space-y-4 grid lg:grid-cols-2 gap-4">
            <h3 className="text-lg col-span-2 font-semibold flex items-center gap-2">
              <User size={18} />
              Personal Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } ${
                  theme === "white" 
                    ? "bg-gray-50 text-[#001324] focus:bg-white" 
                    : "bg-gray-800 text-white focus:bg-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#004e2e] transition-all`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                } ${
                  theme === "white" 
                    ? "bg-gray-50 text-[#001324] focus:bg-white" 
                    : "bg-gray-800 text-white focus:bg-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#004e2e] transition-all`}
                placeholder="Enter your phone number"
              />
              {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home size={18} />
              Project Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin size={16} className="inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } ${
                  theme === "white" 
                    ? "bg-gray-50 text-[#001324] focus:bg-white" 
                    : "bg-gray-800 text-white focus:bg-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#004e2e] transition-all`}
                placeholder="Enter project location"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Plot Area (sq ft) *
                </label>
                <input
                  type="number"
                  name="plotArea"
                  value={formData.plotArea}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.plotArea ? 'border-red-500' : 'border-gray-300'
                  } ${
                    theme === "white" 
                      ? "bg-gray-50 text-[#001324] focus:bg-white" 
                      : "bg-gray-800 text-white focus:bg-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-[#004e2e] transition-all`}
                  placeholder="0"
                  min="1"
                />
                {errors.plotArea && <p className="text-red-500 text-sm mt-1">{errors.plotArea}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Construction Area (sq ft) *
                </label>
                <input
                  type="number"
                  name="constructionArea"
                  value={formData.constructionArea}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.constructionArea ? 'border-red-500' : 'border-gray-300'
                  } ${
                    theme === "white" 
                      ? "bg-gray-50 text-[#001324] focus:bg-white" 
                      : "bg-gray-800 text-white focus:bg-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-[#004e2e] transition-all`}
                  placeholder="0"
                  min="1"
                />
                {errors.constructionArea && <p className="text-red-500 text-sm mt-1">{errors.constructionArea}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Calculator size={16} className="inline mr-1" />
                Budget (₹) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                } ${
                  theme === "white" 
                    ? "bg-gray-50 text-[#001324] focus:bg-white" 
                    : "bg-gray-800 text-white focus:bg-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#004e2e] transition-all`}
                placeholder="Enter your budget"
                min="1"
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-xl border ${
                theme === "white"
                  ? "border-gray-300 text-[#001324] hover:bg-gray-50"
                  : "border-gray-600 text-white hover:bg-gray-800"
              } font-medium transition-all`}
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-xl bg-[#004e2e] text-white font-medium hover:bg-[#003d24] focus:outline-none focus:ring-2 focus:ring-[#004e2e] transition-all flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Enquiry
                  <MoveRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple component with just the button and modal
const ConstructionEnquiry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="">
      <ButtonCustom
        title="Construction Quote"
        onClick={() => setIsModalOpen(true)}
        theme="dark"
      />

      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        theme="dark"
      />
    </div>
  );
};

export default ConstructionEnquiry;