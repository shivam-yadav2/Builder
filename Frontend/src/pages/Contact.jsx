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

  // 2️⃣ change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3️⃣ submit handler with hot-toast
  const handleSubmit = async (e) => {
    e.preventDefault();

    // optional: basic empty-field check
    const empty = Object.values(formData).some((v) => v === "");
    if (empty) {
      toast.error("Please fill in all fields.");
      return;
    }

    const promise = fetch(
      "https://admin.samadhaangroups.co.in/api/v1/mainEnquiry/add",
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
      success: "Your message has been submitted!",
      error: (err) => err.message || "Submission failed",
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
    }
  };

  // contact card data (unchanged)
  const contactItems = [
    {
      title: "Chat to Sales",
      description: "Speak to our friendly team",
      icon: <MessageSquare className="w-5 h-5" />,
      action: "+91 969-630-3855",
      link: "https://wa.me/+919696303855?text=Hello%20Samadhaan%20Foundation",
    },
    {
      title: "Chat to Support",
      description: "We're here to help",
      icon: <Mail className="w-5 h-5" />,
      action: "samadhaangroups@gmail.com",
      link: "mailto:samadhaangroups@gmail.com",
    },
    {
      title: "Visit us",
      description: "Visit our office HQ.",
      icon: <MapPin className="w-5 h-5" />,
      action: "View on Google Maps",
      link: "https://maps.app.goo.gl/9A1abgbbc4pTUgwX6",
    },
    {
      title: "Call us",
      description: "Mon-Fri 8 am – 5 pm",
      icon: <Phone className="w-5 h-5" />,
      action: "+91 955-462-2666",
      link: "tel:9554622666",
    },
  ];

  const inputClass =
    "w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";

  return (
    <Layout>
      <div className="bg-[#f5f5f5]">
        <div className="container mx-auto py-5 lg:py-10">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl capitalize font-bold text-[#001324]">
              We’re Here to Help!
            </h1>
            <p className="text-md mt-3">
              Got questions? Need assistance? Reach out to us,&nbsp;and we’ll
              <br className="hidden lg:block" />
              get back to you as soon as possible.
            </p>
          </div>

          {/* Contact cards */}
          <div className="pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
              {contactItems.map((item, i) => (
                <Card
                  key={i}
                  className="p-6 flex flex-col items-start text-center hover:shadow-lg transition-shadow duration-300 hover:bg-gray-50/50 border border-gray-300"
                >
                  <div className="p-3 mb-4 border border-gray-400 rounded-full bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div className="flex flex-col w-full items-start gap-1">
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <Button
                      className="w-full bg-[#096da4] hover:scale-105 hover:rotate-1 active:scale-95 hover:bg-[#096ea4e1] transition-all"
                      asChild
                    >
                      <a href={item.link}>{item.action}</a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="relative py-5">
            <div className="bg-white rounded-3xl shadow relative z-20">
              <div className="flex items-center justify-center">
                <div className="w-full p-8 bg-white rounded-2xl shadow-lg">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="budget"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Project Budget
                        </label>
                        <Input
                          id="budget"
                          name="budget"
                          type="number"
                          value={formData.budget}
                          onChange={handleChange}
                          className={`${inputClass} no-spinner`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="number"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number
                        </label>
                        <Input
                          id="number"
                         
                          type="number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`${inputClass} no-spinner`}
                        />
                      </div>
                    </div>

                    {/* message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        What are you interested in?
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full h-32 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* submit button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-[#096da4] hover:bg-[#085a85] px-6 py-2 flex items-center gap-2"
                      >
                        Submit
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* decorative layer */}
            <div className="absolute top-0 w-full h-full flex justify-center items-center -z-0">
              <div className="w-[95%] h-full rounded-3xl bg-[#096da4]" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
