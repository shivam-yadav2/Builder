import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export function LoginFormInquiry({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("vsjdfghfgjfthfg565rtvffrfsfndlmn");
    console.log(token);
  
    if (token) {
      navigate("/inquiry-dashboard");
    }
  }, []);


  const onSubmit = async (data) => {
    const id = toast.loading("Logging In ...");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/admin/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setTimeout(() => {
          toast.success("Admin Logged In Successfully", { id });
          localStorage.setItem("vsjdfghfgjfthfg565rtvffrfsfndlmn", response?.data?.data?.token);
          navigate("/inquiry-dashboard");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          toast.error("Wong Credentials", { id });
        }, 1000);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to Fashion Academy Inquiry Dashboard</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                <NavLink to="/inquiry-dashboard">Login</NavLink>
                
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
