import { LoginForm } from "@/components/login-form";
import React, { useEffect } from "react";
import { LoginFormInquiry } from "@/components/login-form inquary";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Login() {
  const token = Cookies.get('accessTokenAdmin');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
