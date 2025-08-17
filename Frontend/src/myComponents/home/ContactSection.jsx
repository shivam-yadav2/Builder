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
            "http://localhost:4000/api/v1/enquiry/add-enquiry",
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
            backgroundPosition: "center"
        }}>
            <div className="absolute w-full h-full top-0 left-0 bg-black/40"></div>

            <div className="relative z-10 container mx-auto px-6 py-16 flex items-center">
                <Toaster />
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-16 w-full max-w-7xl mx-auto">

                    {/* Left Side - Contact Information */}
                    <div className="col-span-3 text-white space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold mb-2">
                                Ready to Build Your Dream Home?
                            </h2>
                            <h3 className="text-3xl font-bold mb-2">
                                Contact RsusBuilders
                            </h3>
                            <p className="text-xl">
                                We're Here to Bring Your Vision to Life
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-medium">Contact</h4>

                            <div className="flex items-start space-x-3">
                                <MapPin size={20} className="text-white mt-1" />
                                <div>
                                    <p className="font-medium">Jl. Pajajaran Indah No.123 Majasaya Bandung</p>
                                    <p className="font-medium">Indonesia</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Phone size={20} className="text-white" />
                                <p className="font-medium">+62-21-123-4567</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail size={20} className="text-white" />
                                <p className="font-medium">info@rsusbuilders.com</p>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium">Social Media</h4>
                            <div className="flex space-x-4">
                                <Facebook size={24} className="text-white" />
                                <Twitter size={24} className="text-white" />
                                <Instagram size={24} className="text-white" />
                            </div>
                            <p className="text-white">RsusBuilders</p>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="col-span-4 flex items-center px-12 justify-end">
                        <div className="bg-white p-8 w-full">
                            <h3 className="text-2xl font-bold text-emerald-600 mb-6">
                                Get in Touch with RsusBuilders
                            </h3>

                            <div className=" grid lg:grid-cols-2 gap-6">
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
                                        className="w-full px-4 py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600"
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
                                        className="w-full px-4 py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600"
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
                                        className="w-full px-4 py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600"
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
                                        className="w-full px-4 py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600"
                                    />
                                </div>

                                <div className='col-span-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        What are you interested in?
                                    </label>
                                    <textarea
                                        name="message"
                                        placeholder="Your message..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600 resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full col-span-2 bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition-colors"
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