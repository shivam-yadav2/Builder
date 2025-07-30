import React, { useState } from 'react';
import { Search, Home, DollarSign, MapPin, ChevronDown } from 'lucide-react';

const RealEstateLanding = () => {
    const [propertyType, setPropertyType] = useState('Sell');
    const [houseType, setHouseType] = useState('House Type');
    const [priceRange, setPriceRange] = useState('Price Range');

    return (
        <div style={{
            backgroundImage: "url('/assets/img/bgsec.png')",
            backgroundPosition:"center"
        }} className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 relative overflow-hidden">
            {/* Decorative Elements
            <div className="absolute top-8 right-16 flex space-x-4">
                <div className="w-12 h-16 bg-white rounded-lg shadow-lg flex items-end justify-center pb-2">
                    <div className="w-6 h-8 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-sm"></div>
                </div>
                <div className="w-12 h-16 bg-white rounded-lg shadow-lg flex items-end justify-center pb-2">
                    <div className="w-6 h-8 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-sm"></div>
                </div>
                <div className="w-12 h-16 bg-white rounded-lg shadow-lg flex items-end justify-center pb-2">
                    <div className="w-6 h-8 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-sm"></div>
                </div>
            </div> */}

            {/* Floating Shelf */}
            {/* <div className="absolute top-32 right-20 w-32 h-24 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-lg shadow-xl transform rotate-12 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center">
                    <div className="w-8 h-8 bg-emerald-400 rounded-full"></div>
                </div>
            </div> */}

            {/* Left side plants */}
            {/* <div className="absolute left-8 top-1/2 transform -translate-y-1/2 space-y-8">
                <div className="w-16 h-20 bg-emerald-800 rounded-lg shadow-lg"></div>
                <div className="w-12 h-32 bg-yellow-600 opacity-75"></div>
            </div> */}

            {/* Right side plant */}
            {/* <div className="absolute right-8 bottom-16 w-20 h-32 bg-gradient-to-t from-yellow-700 via-green-600 to-green-400 rounded-lg shadow-xl"></div> */}

            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Find Your Dream Home
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        Now you can save on all stress, time, and hidden costs with hundreds of homes to choose from
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 mb-16">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Property Type Buttons */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {['Sell', 'Rent', 'New Property'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setPropertyType(type)}
                                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${propertyType === type
                                            ? 'bg-emerald-500 text-white shadow-md'
                                            : 'text-gray-600 hover:text-emerald-600'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Dropdowns */}
                        <div className="flex-1 flex items-center gap-4">
                            <div className="relative">
                                <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
                                    <Home size={20} className="text-emerald-500" />
                                    <span className="text-gray-700">{houseType}</span>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="relative">
                                <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
                                    <DollarSign size={20} className="text-emerald-500" />
                                    <span className="text-gray-700">{priceRange}</span>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by location, ID, Property"
                                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                    />
                                    <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                                </div>
                            </div>

                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl flex items-center gap-2">
                                <Search size={20} />
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                

                {/* Features */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Home size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Premium Properties</h3>
                        <p className="text-white/80">Curated selection of the finest homes</p>
                    </div>

                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                        <p className="text-white/80">Find exactly what you're looking for</p>
                    </div>

                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSign size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                        <p className="text-white/80">Competitive pricing with no hidden fees</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealEstateLanding;