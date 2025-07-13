import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/loginSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Layout from "@/layout/Layout";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const id = toast.loading("Logging In ...");

    try {
      const response = await axios.post(
        // Use this for local testing
        // "http://localhost:4000/api/v1/users/signin",
        // Switch to this for production
        "https://admin.samadhaangroups.co.in/api/v1/users/signin",
        JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("API Response:", JSON.stringify(response.data));
      // Set accessToken and refreshToken to cookies
      Cookies.set("accessToken", response?.data?.data?.accessToken, {
        expires: 1, // 1 day
        secure: true, // Use HTTPS in production
        sameSite: "Strict", // Prevent CSRF
      });
      Cookies.set("refreshToken", response?.data?.data?.refreshToken, {
        expires: 10, // 10 days
        secure: true,
        sameSite: "Strict",
      });
      setTimeout(() => {
        toast.success("Login successful!", { id });
        navigate("/");
      }, 1000);
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
                id: `${id}-field-${index}`,
                duration: 4000,
              });
            }
            // For general errors without field
            else if (err.message) {
              toast.error(err.message, {
                id: `${id}-error-${index}`,
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

  return (
    <Layout>
      <div className="bg-[#f5f5f5]">
        <div className="container mx-auto py-5 max-w-6xl lg:py-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl capitalize font-bold text-[#001324]">
              Login to Your Account
            </h1>
            <p className="text-md mt-3">
              Access your account securely and explore our services.
            </p>
          </div>
          <div className="relative py-5">
            <div className="bg-white rounded-3xl w-full relative z-20">
              <div className="flex items-center justify-center">
                <div className="w-full p-8 bg-white rounded-2xl max-w-lg">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <Label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Email
                              </Label>
                              <FormControl>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="m@example.com"
                                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <Label
                                  htmlFor="password"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Password
                                </Label>
                                {/* <a
                                  href="#"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Forgot password?
                                </a> */}
                              </div>
                              <FormControl>
                                <Input
                                  id="password"
                                  type="password"
                                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button
                          type="submit"
                          className="w-full bg-[#096da4] hover:bg-[#085a85] text-white"
                        >
                          Login
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
                      <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <NavLink
                          to="/signup"
                          className="underline underline-offset-4 text-blue-600"
                        >
                          Sign up
                        </NavLink>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
            <div className="absolute top-0 w-full h-full flex justify-center items-center -z-0">
              <div className="w-[95%] rounded-3xl h-full bg-[#096da4]"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
