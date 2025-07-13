import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Button
} from "@/components/ui/button";
import {
    Input
} from "@/components/ui/input";
import {
    Label
} from "@/components/ui/label";
import {
    Alert,
    AlertDescription
} from "@/components/ui/alert";
import DashboardLayout from '@/layout/DashboardLayout';
import MyContext from '@/context/MyContext';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear messages when user starts typing
        setError('');
        setSuccess('');
    };

    const validatePasswords = () => {
        if (!formData.currentPassword) {
            return "Current password is required";
        }
        if (!formData.newPassword) {
            return "New password is required";
        }
        if (formData.newPassword.length < 8) {
            return "New password must be at least 8 characters long";
        }
        if (formData.newPassword === formData.currentPassword) {
            return "New password must be different from current password";
        }
        if (formData.newPassword !== formData.confirmPassword) {
            return "New passwords do not match";    
        }
        return '';
    };

     const context = useContext(MyContext)
    const { accessToken } = context

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validatePasswords();
        if (validationError) {
            setError(validationError);
            toast.error(validationError);
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Changing password...');

        try {
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://admin.samadhaangroups.co.in/api/v1/users/change-password',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: You'll need to provide the actual token here
                    'Authorization': accessToken
                },
                data: JSON.stringify({
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            };

            const response = await axios.request(config);

            setSuccess("Password changed successfully!");
            toast.success("Password changed successfully!", { id: toastId });
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to change password. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-start justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter current password"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter new password"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Confirm new password"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success">
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Changing..." : "Change Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            {/* <Toaster position="top-right" /> */}
        </DashboardLayout>
    );
};

export default ChangePassword;