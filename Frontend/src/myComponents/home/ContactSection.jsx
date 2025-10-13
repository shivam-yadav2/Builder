import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        budget: '',
        phone: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic empty-field check
        const empty = Object.values(formData).some((v) => v === "");
        if (empty) {
            toast.error("Please fill in all fields.", {
                duration: 4000,
                position: 'top-right'
            });
            return;
        }

        const promise = fetch(
            "https://backend.rsusb2sbuildersconstructions.com/api/v1/enquiry/add-enquiry",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            }
        ).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Server error");
            return data;
        });

        toast.promise(promise, {
            loading: "Sending...",
            success: "Your enquiry has been submitted! We'll get back to you soon.",
            error: (err) => err.message || "Submission failed",
        }, {
            duration: 4000,
            position: 'top-right'
        });

        try {
            await promise;
            // Reset fields
            setFormData({
                name: '',
                email: '',
                budget: '',
                phone: '',
                message: ''
            });
        } catch {
            /* toast.promise already shows error */
        }
    };

    return (
        <div className="relative" style={{
            backgroundImage: "url('/assets/img/bgcon.png')",
            backgroundPosition: "center",
            backgroundSize: "cover"
        }}>
            <div className="absolute w-full h-full top-0 left-0 bg-black/40"></div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex items-center">
                <Toaster />
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 sm:gap-12 lg:gap-16 w-full max-w-7xl mx-auto">
                    {/* Left Side - Contact Information */}
                    <div className="col-span-1 lg:col-span-3 text-white space-y-6 sm:space-y-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                Ready to Build Your Dream Home?
                            </h2>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                                Contact RsusBuilders
                            </h3>
                            <p className="text-base sm:text-lg lg:text-xl">
                                We're Here to Bring Your Vision to Life
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-4 sm:space-y-6">
                            <h4 className="text-base sm:text-lg font-medium">Contact</h4>

                            <div className="flex items-start space-x-3">
                                <MapPin size={16} className="text-white mt-1 " />
                                <div>
                                    <p className="font-medium text-sm sm:text-base">
                                        Jl. Pajajaran Indah No.123 Majasaya Bandung
                                    </p>
                                    <p className="font-medium text-sm sm:text-base">Indonesia</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Phone size={16} className="text-white " />
                                <p className="font-medium text-sm sm:text-base">+62-21-123-4567</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail size={16} className="text-white " />
                                <p className="font-medium text-sm sm:text-base">info@rsusbuilders.com</p>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-4">
                            <h4 className="text-base sm:text-lg font-medium">Social Media</h4>
                            <div className="flex space-x-4">
                                <Facebook size={20} className="text-white" />
                                <Twitter size={20} className="text-white" />
                                <Instagram size={20} className="text-white" />
                            </div>
                            <p className="text-white text-sm sm:text-base">RsusBuilders</p>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="col-span-1 lg:col-span-4 flex items-center justify-center lg:justify-end">
                        <div className="bg-white p-6 sm:p-8 w-full max-w-full sm:max-w-lg lg:max-w-2xl">
                            <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-4 sm:mb-6">
                                Get in Touch with RsusBuilders
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name here..."
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600 text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email here..."
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600 text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Budget
                                    </label>
                                    <input
                                        type="number"
                                        name="budget"
                                        placeholder="Enter your budget..."
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600 text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter your phone number..."
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600 text-sm sm:text-base"
                                    />
                                </div>

                                <div className="col-span-1 lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        What are you interested in?
                                    </label>
                                    <textarea
                                        name="message"
                                        placeholder="Your message..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600 resize-none text-sm sm:text-base"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full col-span-1 lg:col-span-2 bg-emerald-500 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-emerald-600 transition-colors text-sm sm:text-base"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;