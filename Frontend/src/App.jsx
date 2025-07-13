import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./auth/Signup";
import { Toaster } from "react-hot-toast";
import Login from "./auth/Login";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Smooth from "./utils/Smooth";
import MyState from "./context/MyState";
import Dashboard from "./pages/dashboard/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import Profile from "./pages/dashboard/Profile";
import ChangePassword from "./pages/dashboard/ChangePassword";
import MyPropertiesPage from "./pages/dashboard/MyProperties";
import AddPropertyPage from "./pages/dashboard/AddProperty";
import ScrollToTop from "./utils/ScrollTop";
import FilteredProperties from "./pages/FilteredProperties";
import ForgetPassword from "./auth/ForgotPassword";
function App() {
  return (
    <Smooth>
      <MyState>
        <BrowserRouter>
        <ScrollToTop/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot_password" element={<ForgetPassword />} />

            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/property" element={<Properties/>} />
            <Route path="/filtered-properties" element={<FilteredProperties />} /> {/* Filter page */}
            <Route path="/property-details/:type?/:id?" element={<PropertyDetailsPage />} />
            {/* DASHBOARD ROUTES
             */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user_profile" element={<Profile />} />
            <Route path="/update_password" element={<ChangePassword />} />
            <Route path="/my_properties" element={<MyPropertiesPage />} />
            <Route path="/add_properties" element={<AddPropertyPage />} />
          </Routes>
        </BrowserRouter>
      </MyState>
      <Toaster />
    </Smooth>
 
  );
}

export default App;
