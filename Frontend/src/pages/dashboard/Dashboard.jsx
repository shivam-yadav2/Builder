import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, DollarSign, Users, Loader2 } from 'lucide-react';
import DashboardLayout from '@/layout/DashboardLayout';
import MyContext from '@/context/MyContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Dashboard = () => {
    const { userData } = useContext(MyContext);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // User data
    const [user, setUser] = useState({
        avatar: userData?.avatar
            ? `https://admin.samadhaangroups.co.in/${userData.avatar}`
            : 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png',
        name: userData?.name || 'Guest',
        phone: userData?.phone || 'N/A',
        email: userData?.email || 'N/A',
    });

    // Fetch properties
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = JSON.stringify({
                    creatorType: "User",
                    userId: userData._id,
                });

                const config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: "https://admin.samadhaangroups.co.in/api/v1/users/user-properties",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                    data: data,
                };

                const response = await axios.request(config);
                setProperties(response.data?.data || []);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch properties. Please try again later.");
                setLoading(false);
                console.error(error);
            }
        };

        if (userData?._id) {
            fetchProperties();
        } else {
            setLoading(false);
            setError("User data not available.");
        }
    }, [userData]);

    // Calculate stats dynamically
    const stats = [
        {
            title: "Properties Owned",
            value: properties.length,
            icon: Home,
        },
        {
            title: "Total Value",
            value: properties.reduce((sum, prop) => sum + (prop.price || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            icon: DollarSign,
        },
        {
            title: "Active Tenants",
            value: properties.filter(prop => prop.status === 'Occupied').length,
            icon: Users,
        },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block">
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                                <stat.icon className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Recent Properties */}
                    <Card className="lg:col-span-2 shadow-md">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-semibold text-gray-800">Recent Properties</CardTitle>
                                <Link to="/my_properties">
                                    <Button variant="outline" size="sm" className="text-blue-500 border-blue-500 hover:bg-blue-50">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                </div>
                            ) : error ? (
                                <div className="text-red-500 text-center py-4">{error}</div>
                            ) : properties.length === 0 ? (
                                <div className="text-gray-500 text-center py-4">No properties found.</div>
                            ) : (
                                <div className="space-y-4">
                                    {properties.slice(0, 3).map((property) => (
                                        <div
                                            key={property._id}
                                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <div>
                                                <h3 className="font-medium text-gray-800">{property.name}</h3>
                                                <p className="text-sm text-gray-500">Status: {property.status || 'N/A'}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <p className="font-medium text-gray-800">
                                                    {(property.rent || property.price || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}/mo
                                                </p>
                                                <Link to={`/properties/${property._id}`}>
                                                    <Button variant="ghost" size="sm" className="mt-1 text-blue-500 hover:text-blue-600">
                                                        Manage
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link to="/add_properties">
                                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                                    Add New Property
                                </Button>
                            </Link>
                            <Link to="/my_properties">
                                <Button variant="outline" className="w-full text-blue-500 border-blue-500 hover:bg-blue-50">
                                    My Properties
                                </Button>
                            </Link>
                            <Link to="/update_password">
                                <Button variant="outline" className="w-full text-blue-500 border-blue-500 hover:bg-blue-50">
                                    Update Password
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;