import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaStar } from "react-icons/fa";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Testimonial = () => {
  // Sample testimonial data
  const testimonials = [
    {
      name: "Annette Black",
      role: "CEO Themsflat",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      text: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
    },
    {
      name: "Bessie Cooper",
      role: "CEO Themsflat",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 5,
      text: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
    },
    {
      name: "Courtney Henry",
      role: "CEO Themsflat",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      text: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
    },
    {
      name: "Courtney Henry",
      role: "CEO Themsflat",
      avatar: "https://i.pravatar.cc/150?img=4",
      rating: 5,
      text: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
    },
    {
      name: "John Doe",
      role: "CEO Themsflat",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
    },
    {
      name: "Jane Smith",
      role: "CEO Themsflat",
      avatar: "https://i.pravatar.cc/150?img=6",
      rating: 5,
      text: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
    },
  ];

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