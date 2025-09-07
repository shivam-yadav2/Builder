import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Square, Building, DollarSign, Send, Zap, Sparkles, Home, Search } from 'lucide-react';

const RealEstateLanding = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Reset form on success
            setFormData({
                name: '',
                number: '',
                location: '',
                plotArea: '',
                constructionArea: '',
                budget: ''
            });
            
            // Show success message (you can replace with your toast implementation)
            alert('🎉 Enquiry submitted successfully! We will contact you soon.');
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('❌ Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            backgroundImage: "url('/assets/img/bgsec.png')",
            backgroundPosition: "center"
        }} className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 relative overflow-hidden">
            
            {/* Enhanced background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-10 w-24 h-24 bg-emerald-300/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Enhanced Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                        <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                        <span className="text-white font-medium">Premium Real Estate Platform</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Find Your Dream Home
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        Submit your requirements and let our experts help you find the perfect property
                    </p>
                </div>

                {/* Enhanced Enquiry Form */}
                <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-16 border border-white/20">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">Property Enquiry Form</h2>
                        <p className="text-gray-600">Fill in your details and requirements to get personalized property recommendations</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            
                            {/* Name Field */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-4 pl-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 focus:scale-[1.02] font-medium ${
                                            errors.name 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:bg-white'
                                        }`}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg group-focus-within:bg-emerald-500/20 transition-colors">
                                            <User className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                            </div>

                            {/* Phone Number Field */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="tel"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleInputChange}
                                        placeholder="Enter 10-digit number"
                                        className={`w-full px-4 py-4 pl-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 focus:scale-[1.02] font-medium ${
                                            errors.number 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:bg-white'
                                        }`}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg group-focus-within:bg-emerald-500/20 transition-colors">
                                            <Phone className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                                {errors.number && <p className="text-red-500 text-sm mt-2">{errors.number}</p>}
                            </div>

                            {/* Location Field */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Preferred Location *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="City, Area, or Locality"
                                        className={`w-full px-4 py-4 pl-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 focus:scale-[1.02] font-medium ${
                                            errors.location 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:bg-white'
                                        }`}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg group-focus-within:bg-emerald-500/20 transition-colors">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                                {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
                            </div>

                            {/* Plot Area Field */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Plot Area (sq ft) *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        name="plotArea"
                                        value={formData.plotArea}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 2000"
                                        min="0"
                                        className={`w-full px-4 py-4 pl-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 focus:scale-[1.02] font-medium ${
                                            errors.plotArea 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:bg-white'
                                        }`}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg group-focus-within:bg-emerald-500/20 transition-colors">
                                            <Square className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                                {errors.plotArea && <p className="text-red-500 text-sm mt-2">{errors.plotArea}</p>}
                            </div>

                            {/* Construction Area Field */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Construction Area (sq ft) *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        name="constructionArea"
                                        value={formData.constructionArea}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 1500"
                                        min="0"
                                        className={`w-full px-4 py-4 pl-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 focus:scale-[1.02] font-medium ${
                                            errors.constructionArea 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:bg-white'
                                        }`}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg group-focus-within:bg-emerald-500/20 transition-colors">
                                            <Building className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                                {errors.constructionArea && <p className="text-red-500 text-sm mt-2">{errors.constructionArea}</p>}
                            </div>

                            {/* Budget Field */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Budget (₹ Lakhs) *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 50"
                                        min="0"
                                        className={`w-full px-4 py-4 pl-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 focus:scale-[1.02] font-medium ${
                                            errors.budget 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                                : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:bg-white'
                                        }`}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg group-focus-within:bg-emerald-500/20 transition-colors">
                                            <DollarSign className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                                {errors.budget && <p className="text-red-500 text-sm mt-2">{errors.budget}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative px-12 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-3 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {/* Animated background shimmer */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                
                                <div className="relative flex items-center space-x-3">
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span className="text-lg">Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="text-lg">Submit Enquiry</span>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>
                </div>

               
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #059669, #047857);
                }
                
                @keyframes slide-in-from-top-2 {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-in {
                    animation-fill-mode: both;
                }
            `}</style>
        </div>
    );
};

export default RealEstateLanding;