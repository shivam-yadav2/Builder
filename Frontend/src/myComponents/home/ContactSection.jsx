import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        email: '',
        question: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className=" relative" style={{
            backgroundImage: "url('/assets/img/bgcon.png')",
            backgroundPosition:"center"
        }}>
            <div className="absolute w-full h-full top-0 left-0 bg-black/40"></div>

            <div className="relative z-10 container mx-auto px-6 py-16  flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-16 w-full max-w-7xl mx-auto">

                    {/* Left Side - Contact Information */}
                    <div className="col-span-3 text-white space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold mb-2">
                                Need Consultation..?
                            </h2>
                            <h3 className="text-3xl font-bold mb-2">
                                Contact Us
                            </h3>
                            <p className="text-xl">
                                We're Ready to Help
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
                                <p className="font-medium">+62-21-xxx-xxxx</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail size={20} className="text-white" />
                                <p className="font-medium">rumahmimpian@gmail.com</p>
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
                            <p className="text-white">RumahImpian</p>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="col-span-4 flex items-center px-12 justify-end">
                        <div className="bg-white  p-8 w-full ">
                            <h3 className="text-2xl font-bold text-emerald-600 mb-6">
                                Have a Question..?
                            </h3>

                            <div className="space-y-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email here..."
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600"
                                />

                                <textarea
                                    name="question"
                                    placeholder="Your Question..."
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-200 rounded-lg border-0 focus:outline-none focus:ring-0 placeholder-gray-600 resize-none"
                                />

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition-colors"
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