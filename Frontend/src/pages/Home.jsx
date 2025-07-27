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
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decodedUserData, setDecodedUserData] = useState();

  const refreshToken = Cookies.get("refreshToken");
  const accessToken = Cookies.get("accessToken");

  const authCheck = () => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      setIsLoggedIn(true);
      setDecodedUserData(decoded);
    }
  };

  useEffect(() => {
    authCheck();
  }, [refreshToken, accessToken]);

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
        apiUrl = "http://localhost:4000/api/v1/rentFilter/add";
        loadingToast = toast.loading("Applying rent filter... Please wait...");
      } else if (modalType === "For Construction") {
        apiUrl =
          "http://localhost:4000/api/v1/constructionFilter/add";
        loadingToast = toast.loading(
          "Submitting construction details... Please wait..."
        );
      } else if (modalType === "For Buy") {
        apiUrl = "http://localhost:4000/api/v1/sellFilter/add";
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
          <div className="w-full h-[95vh]">
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
          </div>
          <FeaturedProperty />
          <Separator />
          <WhyChooseUs />
          <Separator />
          <Service />
          <OurProperties />
          <TopProperty />
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
