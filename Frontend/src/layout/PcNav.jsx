import React from "react";
import { NavLink } from "react-router-dom";
import { UserPlus } from "lucide-react";

const PcNav = () => {
  return (
    <div className="font-bold shadow-xl border-b-2 border-gray-700 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-6 gap-4 lg:gap-0">
          <div className="logo lg:col-span-2 col-span-1 ">
            <NavLink
              to="/"
              className="lg:text-3xl text-2xl flex items-center h-16"
            >
              Samadhan
            </NavLink>
          </div>

          <ul className="lg:col-span-4 col-span-5 ml-10 lg:ml-0 ">
            <div className="flex justify-between  items-center h-16 lg:text-base md:text-sm">
              <li>
                <NavLink
                  to="/"
                  className="hover:border-b-2 hover:border-black"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/rent"
                  className="hover:border-b-2 hover:border-black"
                >
                  Rent
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/purchase"
                  className="hover:border-b-2 hover:border-black"
                >
                  Purchase
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/allProp"
                  className="hover:border-b-2 hover:border-black"
                >
                  All properties
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="hover:border-b-2 hover:border-black"
                >
                  About us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:border-b-2 hover:border-black"
                >
                  Contact us
                </NavLink>
              </li>
              <li>
                <NavLink to="/cta" >
                  <button className="bg-black text-white py-0.5 px-4 rounded-sm border-2 border-black hover:bg-white hover:text-black hover:border-2 hover:border-black lg:-mr-5">
                    CTA
                  </button>
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup">
                  <UserPlus className=" border border-black text-white bg-black w-9 h-9 p-1.5 rounded-full hover:"/>
                </NavLink>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PcNav;
