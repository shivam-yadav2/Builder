import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Service = () => {
  return (
    <div className="py-6 lg:py-10 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 l 0 -60 z' fill='none' stroke='%23059669' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
          }} />
        </div>
        
        {/* Floating Dots */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-15 blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6 relative">
                Our Real Estate Services
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              </h1>
            </div>
            <p className="text-xl text-gray-600 font-medium">
              Buy, Rent, or Build — we make your dream home a reality.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Buy Property */}
            <Card className="group bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-700 text-white border-0 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='dots' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3ccircle cx='20' cy='20' r='2' fill='%23ffffff'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23dots)' /%3e%3c/svg%3e")`,
                }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="relative z-10 p-10 text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6">
                  Buy Properties
                </h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  Explore premium apartments, villas, and commercial spaces at the best market prices.
                </p>
              </CardContent>
            </Card>

            {/* Rent Property */}
            <Card className="group bg-white/80 backdrop-blur-sm border border-emerald-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
              
              <CardContent className="relative z-10 p-10 text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6 text-emerald-600">
                  Rent Homes
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Find affordable and luxurious rental homes with flexible lease options for families and individuals.
                </p>
              </CardContent>
            </Card>

            {/* Build Your Dream Home */}
            <Card className="group bg-white/80 backdrop-blur-sm border border-emerald-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
              
              <CardContent className="relative z-10 p-10 text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6 text-emerald-600">
                  Build Your Dream Home
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Share your vision, and we’ll design and construct your perfect home with world-class architecture.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-6 h-6 border-2 border-emerald-300 rounded-full opacity-20 animate-spin" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-3/4 right-16 w-4 h-4 border-2 border-green-300 rounded-sm opacity-30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
    </div>
  );
};

export default Service;