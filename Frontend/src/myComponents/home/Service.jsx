import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Service = ({ onBuyClick, onRentClick, onConstructionClick }) => {
  const services = [
    {
      key: 'buy',
      title: 'Buy Properties',
      description:
        'Explore premium apartments, villas, and commercial spaces at the best market prices.',
      onClick: onBuyClick,
      cardClass:
        'bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-700 text-white border-0',
      iconBg: 'bg-white',
      iconColor: 'text-emerald-600',
      titleClass: 'text-white',
      descClass: 'text-white/90',
      svgPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    },
    {
      key: 'rent',
      title: 'Sell Your Property',
      description:
        'If you want to sell your property, contact us and we will guide you through listing, checking, and final steps.',
      onClick: onRentClick,
      cardClass: 'bg-white/80 backdrop-blur-sm border border-emerald-100',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-green-100',
      iconColor: 'text-emerald-600',
      titleClass: 'text-emerald-600',
      descClass: 'text-gray-600',
      svgPath: 'M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z',
    },
    {
      key: 'construction',
      title: 'Home Construction Services',
      description:
        'Share your plan with us, and we will help with home construction from start to finish.',
      onClick: onConstructionClick,
      cardClass: 'bg-white/80 backdrop-blur-sm border border-emerald-100',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-green-100',
      iconColor: 'text-emerald-600',
      titleClass: 'text-emerald-600',
      descClass: 'text-gray-600',
      svgPath: 'M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3z',
    },
  ];

  const renderCard = (s) => (
    <Card
      onClick={s.onClick}
      className={`group ${s.cardClass} cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden h-full`}
    >
      <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>

      <CardContent className="relative z-10 p-5 sm:p-7 lg:p-10 text-center">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto ${s.iconBg} rounded-full flex items-center justify-center shadow-lg`}
          >
            <svg
              className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${s.iconColor}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d={s.svgPath} />
            </svg>
          </div>
        </div>
        <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 lg:mb-6 ${s.titleClass}`}>
          {s.title}
        </h3>
        <p className={`leading-relaxed text-sm sm:text-base lg:text-lg ${s.descClass}`}>
          {s.description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div id="services" className="py-6 lg:py-10 relative overflow-hidden scroll-mt-20">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 l 0 -60 z' fill='none' stroke='%23059669' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
            }}
          />
        </div>

        <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>

        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-15 blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 px-4 py-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-10 sm:mb-14 lg:mb-20">
            <div className="inline-block relative">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4 sm:mb-6 relative">
                Our Real Estate Services
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-medium px-2">
              Buy, sell, or build with our construction team — we make the process simple and clear.
            </p>
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden pb-10">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.1}
              centeredSlides={true}
              loop={true}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="service-swiper !pb-12"
            >
              {services.map((s) => (
                <SwiperSlide key={s.key} className="h-auto">
                  <div className="h-full px-1 py-2">{renderCard(s)}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((s) => (
              <div key={s.key}>{renderCard(s)}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 left-10 w-6 h-6 border-2 border-emerald-300 rounded-full opacity-20 animate-spin" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-3/4 right-16 w-4 h-4 border-2 border-green-300 rounded-sm opacity-30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>

      <style jsx>{`
        :global(.service-swiper .swiper-pagination-bullet) {
          background: #059669;
          opacity: 0.4;
        }
        :global(.service-swiper .swiper-pagination-bullet-active) {
          opacity: 1;
          background: #047857;
        }
      `}</style>
    </div>
  );
};

export default Service;
