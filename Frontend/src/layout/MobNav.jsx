import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

import React from "react";

const MobNav = () => {
  return (
    <div className="font-bold shadow-xl border-b-2 border-gray-700 px-4">
      <div className="container mx-auto">
        <Sheet>
          <div className="grid grid-cols-2">
            <NavLink
              to="/"
              className="lg:text-3xl text-3xl flex items-center h-16"
            >
              Samadhan
            </NavLink>
            <SheetTrigger>
              <Menu className="ml-auto" />
            </SheetTrigger>
          </div>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <ul className="text-2xl">
                  <li className="mb-2">
                    <NavLink
                      to="/"
                      className="hover:border-b-2 hover:border-black"
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="mb-2">
                    <NavLink
                      to="/rent"
                      className="hover:border-b-2 hover:border-black"
                    >
                      Rent
                    </NavLink>
                  </li>
                  <li className="mb-2">
                    <NavLink
                      to="/purchase"
                      className="hover:border-b-2 hover:border-black"
                    >
                      Purchase
                    </NavLink>
                  </li>
                  <li className="mb-2">
                    <NavLink
                      to="/allProp"
                      className="hover:border-b-2 hover:border-black"
                    >
                      All properties
                    </NavLink>
                  </li>
                  <li className="mb-2">
                    <NavLink
                      to="/about"
                      className="hover:border-b-2 hover:border-black"
                    >
                      About us
                    </NavLink>
                  </li>
                  <li className="mb-5">
                    <NavLink
                      to="/contact"
                      className="hover:border-b-2 hover:border-black"
                    >
                      Contact us
                    </NavLink>
                  </li>
                </ul>
              </SheetTitle>
              <SheetDescription>
                <NavLink to="/cta" className="">
                  <button className="bg-black text-white py-1 px-6 rounded-md border-2 border-black hover:bg-white hover:text-black hover:border-2 hover:border-black text-2xl font-bold">
                    CTA
                  </button>
                </NavLink>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobNav;
