"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../lib/formSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Layout from "@/layout/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      password: "",
      confirm_password: "",
      avatar: null,
    },
  });

  const navigate = useNavigate();

  // State to store image URLs for preview
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [aadhaarImagePreview, setAadhaarImagePreview] = useState(null);

  const onSubmit = async (data) => {
    const id = toast.loading("Signing Up New User ...");

    // Log form data with file details for debugging
    // console.log("Form Data:", {
    //   ...data,
    //   avatar: data.avatar
    //     ? { name: data.avatar.name, size: data.avatar.size, type: data.avatar.type }
    //     : null,
    //   aadhaar_image: data.aadhaar_image
    //     ? { name: data.aadhaar_image.name, size: data.aadhaar_image.size, type: data.aadhaar_image.type }
    //     : null,
    // });

    // Create FormData for API submission
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("location", data.location);
    formData.append("password", data.password);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `FormData: ${key} = File { name: ${value.name}, size: ${value.size}, type: ${value.type} }`
        );
      } else {
        console.log(`FormData: ${key} = ${value}`);
      }
    }

    try {
      const response = await axios.post(
        // Use this for local testing
        // "http://localhost:4000/api/v1/users/signup",
        // Switch to this for production
        "http://localhost:4000/api/v1/users/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      console.log("API Response:", response.data);
      if (response?.data?.statusCode === 201) {
        setTimeout(() => {
          navigate("/login");
          toast.success("User registered successfully!", { id });
        }, 1000);
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
                id: id,
                duration: 4000,
              });
            }
            // For general errors without field
            else if (err.message) {
              toast.error(err.message, {
                id: id,
                duration: 4000,
              });
            }
          });
        } else {
          toast.error(errorData.message || "An error occurred", { id });
        }
      } else {
        // Fallback for network errors or unexpected errors
        toast.error("Network error. Please try again.", { id });
      }
    }
  };

  // Handle image preview for Profile Image
  const handleProfileImageChange = (e, onChange) => {
    const file = e.target.files[0];
    onChange(file); // Update form state
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImagePreview(imageUrl);
      console.log("Selected Profile Image:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    } else {
      setProfileImagePreview(null);
    }
  };

  // Handle image preview for Aadhar Image
  const handleAadhaarImageChange = (e, onChange) => {
    const file = e.target.files[0];
    onChange(file); // Update form state
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAadhaarImagePreview(imageUrl);
      console.log("Selected Aadhaar Image:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    } else {
      setAadhaarImagePreview(null);
    }
  };

  return (
    <Layout>
      <div className="bg-[#f5f5f5] py-10 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#001324]">
              Create Your Account
            </h1>
            <p className="text-md mt-3">
              Fill in the details below to sign up and explore our services.
            </p>
          </div>
          <div className="relative py-5">
            {/* Blue Background Section */}
            <div className="absolute top-0 w-full h-full flex justify-center items-center -z-0">
              <div className="w-[95%] rounded-3xl h-full bg-[#096da4]"></div>
            </div>

            <div className="bg-white rounded-3xl shadow relative z-20">
              <div className="flex items-center justify-center">
                <div className="w-full p-8 bg-white rounded-2xl shadow-lg">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col"
                    >
                      {/* Profile Image at Top Center */}
                      <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                          <FormItem className="flex justify-center mb-6">
                            <div className="relative">
                              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                {profileImagePreview ? (
                                  <img
                                    src={profileImagePreview}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <svg
                                    className="w-16 h-16 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <Label
                                htmlFor="profile-image"
                                className="absolute bottom-0 right-0 bg-[#096da4] text-white rounded-full p-2 cursor-pointer"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </Label>
                              <Input
                                id="profile-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleProfileImageChange(e, field.onChange)
                                }
                              />
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Form Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Name</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter your name"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Phone Number */}
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Phone</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter your phone number"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Email */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Email</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter your email"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Location */}
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Location</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter your location"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Password */}
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Password</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  placeholder="Enter your password"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Confirm Password */}
                        <FormField
                          control={form.control}
                          name="confirm_password"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Confirm Password</Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  placeholder="Confirm your password"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button
                          type="submit"
                          className="bg-[#096da4] hover:bg-[#085a85] text-white"
                        >
                          Register
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
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
