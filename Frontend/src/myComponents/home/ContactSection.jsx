import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageSquare } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const contactLinks = {
    location: 'https://maps.app.goo.gl/kLkiByTNz9FSUEZF8?g_st=aw',
    phone: 'tel:+917905216115',
    whatsapp: 'https://wa.me/+919559387028?text=Hello%20Rsus%20B2S%20Builders%20and%20Constructions',
    email: 'mailto:anujchauhan06059@gmail.com',
};

const socialLinks = [
    { Icon: Facebook, href: 'https://www.facebook.com/share/1BBt4E1Pxt/', label: 'Facebook' },
    { Icon: Instagram, href: 'https://www.instagram.com/rsus.b2sbuilderandconstruction?igsh=aXUyZ2UxZmlyZ3ph', label: 'Instagram' },
    { Icon: Twitter, href: 'https://x.com/B2sRsus', label: 'Twitter' },
    { Icon: Youtube, href: 'https://youtube.com/@rsus.b2sbuildersandconstru712?si=FXH3tV05TeOwGh4R', label: 'YouTube' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/rsus-b2s-builder-s-and-construction-a7a453244', label: 'LinkedIn' },
    { Icon: MessageSquare, href: 'https://app.explurger.com/dl/MXcZHuV263ZY2UrP8', label: 'Explurger' },
];

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
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/enquiry/add-enquiry`,
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

                            <a
                                href={contactLinks.location}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-3 hover:opacity-80 transition-opacity"
                            >
                                <MapPin size={16} className="text-white mt-1 " />
                                <div>
                                    <p className="font-medium text-sm sm:text-base">
                                        538ka/950 Shiv Lok, Triveni Nagar 3rd, Lucknow
                                    </p>
                                    <p className="font-medium text-sm sm:text-base">Uttar Pradesh , India</p>
                                </div>
                            </a>

                            <a
                                href={contactLinks.phone}
                                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                            >
                                <Phone size={16} className="text-white " />
                                <p className="font-medium text-sm sm:text-base">+91 790-521-6115</p>
                            </a>

                            <a
                                href={contactLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                            >
                                <MessageSquare size={16} className="text-white " />
                                <p className="font-medium text-sm sm:text-base">+91 955-938-7028 (WhatsApp)</p>
                            </a>

                            <a
                                href={contactLinks.email}
                                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                            >
                                <Mail size={16} className="text-white " />
                                <p className="font-medium text-sm sm:text-base">anujchauhan06059@gmail.com</p>
                            </a>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-4">
                            <h4 className="text-base sm:text-lg font-medium">Social Media</h4>
                            <div className="flex flex-wrap gap-4">
                                {socialLinks.map(({ Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="hover:scale-110 hover:-translate-y-0.5 transition-transform"
                                    >
                                        <Icon size={20} className="text-white" />
                                    </a>
                                ))}
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