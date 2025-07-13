import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {  MapPin, Phone,Mail  } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#004e2e] text-white py-10">
      {/* <div className="md:flex justify-between items-center border-b border-gray-700 pb-12 mb-12">
        <div className="lg:pl-22 md:pl-16 pl-6">
          <h2 className="text-2xl font-semibold pb-6 md:pb-0">Samadhaan Foundation</h2>
        </div> 
       
        <div className=" flex items-center  gap-4 md:pr-16 pl-6">
          <p className="font-bold  hidden lg:block">Follow us:</p>
          <a href="" className="border-2 border-white rounded-4xl p-2 bg-gray-800 hover:bg-blue-600">
            <Facebook />
          </a>
          <a href="" className="border-2 border-white rounded-4xl p-2 bg-gray-800 hover:bg-blue-600">
            {" "}
            <Linkedin />
          </a>
          <a href="" className="border-2 border-white rounded-4xl p-2 bg-gray-800 hover:bg-blue-600">
            {" "}
            <Instagram />
          </a>
          <a href="" className="border-2 border-white rounded-4xl p-2 bg-gray-800 hover:bg-blue-600">
            {" "}
            <Youtube />
          </a>
          <a href="" className="border-2 border-white rounded-4xl p-2 bg-gray-800 hover:bg-blue-600">
            {" "}
            <Twitter />
          </a>
        </div>
        
      </div> */}
      <div className="container   px-6 md:px-12 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-10">
        <NavLink to="/" >
          <img src="/assets/logo/logo.png" className="w-[80%] mt-5" alt="" />
        </NavLink>
        <div>
          <p className="text-sm mt-1">
           
          </p>
          <a href="https://maps.app.goo.gl/9A1abgbbc4pTUgwX6" className="text-sm mt-3 flex items-center gap-2">
             <MapPin  size="15"/> LMC 3, Sector C Aliganj Lucknow

          </a>
          <a href="tel:9554622666" className="text-sm mt-3 flex items-center gap-2">
          <Phone size="15"/>  +91 955-462-2666
          </a>
          <a href="mailto:samadhaangroups@gmail.com" className="text-sm mt-3 flex items-center gap-2">
           <Mail size="15"/> samadhaangroups@gmail.com
          </a>
        </div>

        <div>
          <h3 className="text-xl font-semibold ">Categories</h3>
          <ul className="mt-2 space-y-2 text-sm ">
            <li>
              <NavLink
                to="/rent"
                className=" hover:border-b hover:border-white "
              >
              For Rent
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/buy" 
                className=" hover:border-b hover:border-white "
              >
               For Buy
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className=" hover:border-b hover:border-white "
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className=" hover:border-b hover:border-white "
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
        </div>

        {/* <div>
          <h3 className="text-xl font-semibold">Our Company</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <NavLink
                to="/property_for_sale"
                className=" hover:border-b hover:border-white "
              >
                Property For Sale
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/property_for_rent"
                className=" hover:border-b hover:border-white "
              >
                Property For Rent
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/property_for_buy"
                className=" hover:border-b hover:border-white "
              >
                Property For Buy
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/our_agents"
                className=" hover:border-b hover:border-white "
              >
                Our Agents
              </NavLink>
            </li>
          </ul>
        </div> */}

        {/* <div>
          <h3 className="text-xl font-semibold">Newsletter</h3>
          <p className="text-sm mt-2">
            Your Weekly/Monthly Dose of Knowledge and Inspiration
          </p>
          <div className="flex items-center mt-4 bg-gray-800 gap-3 p-2 rounded-lg">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-transparent text-white border-none outline-none flex-1"
            />
            <Button className="bg-blue-500 hover:bg-blue-600 px-4 py-3 text-xl text-center">
              &gt;
            </Button>
          </div>
        </div> */}
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p className="text-sm mx-auto">&copy;2024 Samadhaan Foundation. All Rights Reserved.</p>
        {/* <div className="flex flex-wrap justify-center space-x-6 text-sm mt-4 md:mt-0">
          <a
            href="#"
            className="border-b border-gray-900 hover:border-b hover:border-white"
          >
            Terms Of Services
          </a>
          <a
            href="#"
            className="border-b border-gray-900 hover:border-b hover:border-white"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="border-b border-gray-900 hover:border-b hover:border-white"
          >
            Cookie Policy
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
