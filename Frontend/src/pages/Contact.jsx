// src/pages/Contact.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";

import Layout from "@/layout/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  Send,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const Contact = () => {
  // 1️⃣ state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2️⃣ change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3️⃣ submit handler with hot-toast
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // optional: basic empty-field check
    const empty = Object.values(formData).some((v) => v === "");
    if (empty) {
      toast.error("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    const promise = fetch("https://backend.rsusb2sbuildersconstructions.com/api/v1/enquiry/add-enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Server error");
      return data;
    });

    toast.promise(promise, {
      loading: "Sending your message...",
      success: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>Your message has been sent successfully!</span>
        </div>
      ),
      error: (err) => err.message || "Failed to send message",
    });

    try {
      await promise;
      // reset fields
      setFormData({
        name: "",
        email: "",
        budget: "",
        phone: "",
        message: "",
      });
    } catch {
      /* toast.promise already shows error */
    } finally {
      setIsSubmitting(false);
    }
  };

  // contact card data - updated with Samadhaan branding
  const contactItems = [
    {
      title: "Chat to Sales",
      description: "Speak to our friendly team",
      icon: <MessageSquare className="w-6 h-6" />,
      action: "WhatsApp Us",
      detail: "+91 969-630-3855",
      link: "https://wa.me/+919696303855?text=Hello%20Samadhaan%20Foundation",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Email Support",
      description: "We're here to help you",
      icon: <Mail className="w-6 h-6" />,
      action: "Send Email",
      detail: "samadhaangroups@gmail.com",
      link: "mailto:samadhaangroups@gmail.com",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Visit Our Office",
      description: "Come see us in person",
      icon: <MapPin className="w-6 h-6" />,
      action: "Get Directions",
      detail: "View on Google Maps",
      link: "https://maps.app.goo.gl/9A1abgbbc4pTUgwX6",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      title: "Call Us Direct",
      description: "Mon-Fri 8 AM – 6 PM",
      icon: <Phone className="w-6 h-6" />,
      action: "Call Now",
      detail: "+91 955-462-2666",
      link: "tel:9554622666",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
  ];

  const inputClass =
    "w-full border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 px-4 py-3 text-gray-700 placeholder:text-gray-400";

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Get in Touch with
              <span className="block text-green-200">Rsus B2S</span>
            </h1>
            <p className="text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Ready to build your dream? We're here to bring your vision to life
              with our expert construction and development services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span>Expert Consultation</span>
              </div>
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span>Professional Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          {/* Contact Cards */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the most convenient way to get in touch with our team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactItems.map((item, i) => (
                <Card
                  key={i}
                  className={`group relative overflow-hidden border-2 ${item.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                >
                  <div className="p-6">
                    <div
                      className={`inline-flex p-3 rounded-full ${item.bgColor} ${item.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">{item.detail}</p>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:scale-105 transition-all duration-300"
                      asChild
                    >
                      <a
                        href={item.link}
                        className="flex items-center justify-center gap-2"
                      >
                        {item.action}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and we'll get back to you within 24
                hours
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl transform rotate-1 scale-105 opacity-10" />

                {/* Form Card */}
                <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="p-8 lg:p-12">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                      {/* Name and Email Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-700"
                          >
                            Your Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700"
                          >
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>

                      {/* Budget and Phone Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label
                            htmlFor="budget"
                            className="block text-sm font-semibold text-gray-700"
                          >
                            Project Budget (₹) *
                          </label>
                          <Input
                            id="budget"
                            name="budget"
                            type="number"
                            placeholder="Enter your budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className={`${inputClass} no-spinner`}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-semibold text-gray-700"
                          >
                            Phone Number *
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`${inputClass} no-spinner`}
                            required
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Project Details *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full h-40 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 px-4 py-3 text-gray-700 placeholder:text-gray-400 resize-none"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                        <p className="text-sm text-gray-500">
                          * Required fields. We'll respond within 24 hours.
                        </p>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:scale-100"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Send className="w-5 h-5" />
                              <span>Send Message</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-transparent rounded-full translate-y-12 -translate-x-12" />
                </Card>
              </div>
            </div>
          </div>

          {/* Bottom Section - Additional Info */}
          <div className="mt-20 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose Samadhaan?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Expert Team
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Professional construction experts with years of experience
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Quality Assured
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We guarantee high-quality materials and workmanship
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    On-Time Delivery
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We respect your timeline and deliver projects on schedule
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
