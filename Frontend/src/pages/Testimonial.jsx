import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaStar } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Build a usable avatar URL: pass-through absolute URLs, prefix server-stored paths.
const resolveAvatar = (avatar, name) => {
  if (!avatar) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
  if (/^https?:\/\//.test(avatar)) return avatar;
  return `${API_BASE_URL}/${avatar}`;
};

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Testimonial = () => {
  // Sample testimonial data — used as a fallback until real ones are added.
  const fallbackTestimonials = [
    {
      name: "Rajesh Sharma",
      role: "Home Buyer, Pune",
      avatar: "",
      rating: 5,
      text: "From site visit to registration, the RSUS team handled everything professionally. They found us the perfect 3BHK within our budget and the whole process was transparent and stress-free.",
    },
    {
      name: "Priya Deshmukh",
      role: "Property Investor",
      avatar: "",
      rating: 5,
      text: "I've worked with several builders, but their attention to detail and honest communication really stood out. The construction quality of my villa exceeded my expectations.",
    },
    {
      name: "Amit Verma",
      role: "First-time Buyer",
      avatar: "",
      rating: 5,
      text: "As a first-time buyer I had a hundred questions, and the team patiently answered every one. They genuinely care about getting you the right home, not just closing a deal.",
    },
    {
      name: "Sneha Patil",
      role: "Homeowner",
      avatar: "",
      rating: 5,
      text: "They built our dream home exactly as promised — on time and within budget. The craftsmanship and finishing are top-notch. Highly recommended for anyone building from scratch.",
    },
    {
      name: "Vikram Singh",
      role: "Commercial Client",
      avatar: "",
      rating: 5,
      text: "Handed over our commercial space ahead of schedule with excellent quality. Their project management and on-site supervision are truly reliable.",
    },
    {
      name: "Anjali Mehta",
      role: "Seller",
      avatar: "",
      rating: 5,
      text: "Sold my property faster than I expected and at a great price. Professional, trustworthy, and always reachable. Couldn't have asked for a smoother experience.",
    },
  ];

  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API_BASE_URL}/api/v1/testimonial/get-all`)
      .then((res) => {
        const data = res.data?.data || [];
        if (active && data.length > 0) {
          setTestimonials(
            data.map((t) => ({
              name: t.name,
              role: t.role || "Customer",
              avatar: resolveAvatar(t.avatar, t.name),
              rating: t.rating || 5,
              text: t.text,
            }))
          );
        }
      })
      .catch(() => {
        /* keep fallback testimonials on error */
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
    <div className="py-15 ">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col gap-3 items-center justify-center ">
      <span className='text-[#1563df] font-semibold text-[15px]'>Our Testimonials</span>
        <h2 className="md:text-4xl text-3xl font-bold ">What's People Say's</h2>
        </div>
        
        <div className="mt-9">
          <Swiper
            modules={[Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            className="mySwiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden h-full">
                  <CardContent className="p-0">
                    <div className=" p-6 text-center">
                      <p className="italic">"{testimonial.text}"</p>
                    </div>
                    <CardFooter className="flex items-center p-6">
                      <Avatar className="w-16 h-16 border-4 border-gray-300">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="text-gray-900 font-semibold text-lg">{testimonial.name}</p>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                        <div className="flex mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </CardFooter>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom pagination container */}
          <div className="swiper-pagination mt-6 flex justify-center"></div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Testimonial