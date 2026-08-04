import { Button } from "@/components/ui/button";
import Layout from "@/layout/Layout";
import React, { useEffect, useState } from "react";
import FeaturedProperty from "./FeaturedProperty";
import Modal from "../myComponents/modal/Modal";
import TopProperty from "./TopProperty";
import Testimonial from "./Testimonial";
import ParallaxSection from "./ParallaxSection";
import { Separator } from "@/components/ui/separator";
import OurProperties from "@/myComponents/home/OurProperties";
import Service from "@/myComponents/home/Service";
import FootContact from "@/myComponents/home/FootContact";
import WhyChooseUs from "@/myComponents/about/WhyChooseUs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { MoveLeft, MoveRight } from "lucide-react";
import toast from "react-hot-toast"; // Import toast
import { NavLink, useNavigate } from "react-router-dom";
import RealEstateLanding from "@/myComponents/home/RealEstateLanding";
import ContactSection from "@/myComponents/home/ContactSection";
import HeroSection from "./Hero";
import RecentlySold from "@/myComponents/home/RecentlySold";

const SellYourPropertySection = () => {
  const points = [
    "Your property will be listed only after verification.",
    "We help you get genuine buyers and clear communication.",
    "Our team supports you from enquiry to final sale.",
  ];

  return (
    <section className="bg-[#f6fbf8] py-10 sm:py-14 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center rounded-3xl bg-white shadow-xl border border-emerald-100 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">
            <p className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
              Sell Your Property
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Want to sell your property?
            </h2>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Contact us if you want to sell your house, plot, or land. We keep the process simple and help you connect with the right buyers.
            </p>

            <div className="mt-6 space-y-3">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 px-4 py-3 text-sm sm:text-base text-gray-700">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 sm:p-8 lg:p-12 text-white h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold">Why sell with us</h3>
            <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed">
              We support owners who want a trusted team to handle the selling process with care and clear steps.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">Verified listing</p>
                <p className="mt-1 text-sm text-white/85">Your property is checked before it goes live.</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold">Easy contact</p>
                <p className="mt-1 text-sm text-white/85">Interested buyers can reach out quickly through our team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({
    rent: {
      type: "home",
      location: "",
      propertyType: "",
      budget: 0,
      name: "",
      number: "",
    },
    sell: { type: "", location: "", area: "", budget: 0, name: "", number: "" },
    construction: {
      plotArea: "",
      constructionArea: "",
      budget: 0,
      location: "",
      name: "",
      number: "",
    },
  });

  // Define convertValuesToNumber function
  function convertValuesToNumber(inputData) {
    const convertedData = { ...inputData };

    if (typeof convertedData.budget === "string") {
      convertedData.budget = parseInt(convertedData.budget, 10);
    }

    if (typeof convertedData.constructionArea === "string") {
      convertedData.constructionArea = parseInt(
        convertedData.constructionArea,
        10
      );
    }
    if (typeof convertedData.plotArea === "string") {
      convertedData.plotArea = parseInt(convertedData.plotArea, 10);
    }

    if (typeof convertedData.area === "string" && convertedData.area !== "") {
      convertedData.area = parseInt(convertedData.area, 10);
    }

    return convertedData;
  }

  console.log(modalType);

  const openModal = (type = 'For Construction') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSellPropertyClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [modalType.toLowerCase()]: {
        ...prev[modalType.toLowerCase()],
        [name]: value,
      },
    }));
  };
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const dataToSend = formData[modalType.toLowerCase()];

    // Convert budget and area to numbers
    const processedData = convertValuesToNumber(dataToSend);

    console.log(processedData);
    const queryParams = new URLSearchParams({
      intent: modalType === "For Rent" ? "rent" : "buy",
      type: processedData.type,
      location: processedData.location,
      budget: processedData.budget,
      ...(processedData.type?.toLowerCase() === "for rent" && {
        propertyType: formData.propertyType,
      }),
      ...(processedData.type?.toLowerCase() === "for buy" && {
        area: formData.area,
      }),
    }).toString();

    // Basic validation for empty fields
    const hasEmptyField = Object.values(processedData).some(
      (value) => value === "" || value === undefined
    );

    if (hasEmptyField) {
      alert("Please fill in all fields.");
      return;
    }

    let apiUrl = "";
    let loadingToast;

    try {
      if (modalType === "For Rent") {
        apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/rentFilter/add`;
        loadingToast = toast.loading("Applying rent filter... Please wait...");
      } else if (modalType === "For Construction") {
        apiUrl =
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/constructionFilter/add`;
        loadingToast = toast.loading(
          "Submitting construction details... Please wait..."
        );
      } else if (modalType === "For Buy") {
        apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/sellFilter/add`;
        loadingToast = toast.loading("Applying buy filter... Please wait...");
      } else {
        alert("Invalid form type");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();
      console.log("API Response:", result);

      navigate(`/filtered-properties?${queryParams}`);

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (modalType === "For Construction") {
        toast.success(
          "Form submitted successfully! We will contact you soon regarding your construction inquiry."
        );
      } else {
        toast.success("Filter applied successfully!");
      }
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);

      // Get error data from response
      const errorData = error.response?.data;

      if (errorData) {
        // Show main error message

        // If there are specific field errors, show them too
        if (errorData.errors && errorData.errors.length > 0) {
          errorData.errors.forEach((err, index) => {
            // For field-specific errors
            if (err.field) {
              toast.error(`${err.field}: ${err.message}`, {
                id: loadingToast,
                duration: 4000,
              });
            }
            // For general errors without field
            else if (err.message) {
              toast.error(err.message, {
                id: loadingToast,
                duration: 4000,
              });
            }
          });
        } else {
          toast.error(errorData.message || "An error occurred", {
            loadingToast,
          });
        }
      } else {
        // Fallback for network errors or unexpected errors
        toast.error("Network error. Please try again.", { loadingToast });
      }
    } finally {
      // Reset form and close modal
      setFormData({
        rent: {
          type: "home",
          location: "",
          propertyType: "",
          budget: 0,
          name: "",
          number: "",
        },
        sell: {
          type: "",
          location: "",
          area: "",
          budget: 0,
          name: "",
          number: "",
        },
        construction: {
          plotArea: "",
          constructionArea: "",
          budget: 0,
          location: "",
          name: "",
          number: "",
        },
      });

      setIsModalOpen(false);
    }
  };

  return (
    <section>
      <div>
        <Layout>
        <HeroSection/>
        <Service
          onBuyClick={() => openModal('For Buy')}
          onRentClick={handleSellPropertyClick}
          onConstructionClick={() => openModal('For Construction')}
        />
        <SellYourPropertySection />
          {/* <div className="w-full h-[95vh]">
            <div className="w-full h-[91vh] relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                autoplay={{ delay: 3000 }}
                loop={true}
                navigation={{
                  nextEl: ".custom-next",
                  prevEl: ".custom-prev",
                }}
              >
                {[
                  "assets/img/bg_banner.png",
                  "assets/img/unplash.jpg",
                  "assets/img/unsplash2.jpg",
                ].map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`Slide ${idx}`}
                      className="w-full h-[91vh] bg-cover object-cover"
                    />
                    <div className="absolute inset-0 bg-black/15"></div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="absolute container w-full z-10 flex flex-col gap-8 items-center top-1/4 md:-translate-x-1/2 md:left-[25rem] text-white">
                <div className="flex flex-col justify-start leading-2">
                  <h1 className="md:text-7xl text-4xl font-semibold">
                    <span className="text-black">Where Every</span> Homes
                  </h1>{" "}
                  <br />
                  <h1 className="md:text-7xl text-4xl font-semibold">
                    <span className="text-black">Feels like</span> Home
                  </h1>
                </div>

              </div>
              <div className="absolute bottom-10 right-10 flex gap-4 z-10">
                <button className="custom-prev cursor-pointer bg-white md:px-5 px-3 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <MoveLeft className="text-black" />
                </button>
                <button className="custom-next cursor-pointer bg-[#004e2e] md:px-5 px-3 rounded-full flex items-center justify-center ">
                  <MoveRight className="text-white" />
                </button>
              </div>
            </div>
          </div> */}
          <FeaturedProperty />
          <RealEstateLanding/>
          <Separator />
          <WhyChooseUs />
          <RecentlySold />
          <Testimonial />
          {/* <Separator /> */}
          {/* <OurProperties /> */}
          {/* <TopProperty /> */}
          <ContactSection/>
          <FootContact />
        </Layout>
        <Modal
          type={modalType}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          formData={formData[modalType.toLowerCase()]}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default Home;
