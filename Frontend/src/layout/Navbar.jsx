import { useContext, useEffect, useState } from "react";
import { Menu, ShoppingCart, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { NavLink } from "react-router-dom";
import MyContext from "@/context/MyContext";
import ButtonCustom from "@/utils/ButtonCustom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decodedUserData, setDecodedUserData] = useState();

  const refreshToken = Cookies.get("refreshToken");
  const accessToken = Cookies.get("accessToken");

  const authCheck = () => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      setIsLoggedIn(true);
      setDecodedUserData(decoded);
    }
  };

  useEffect(() => {
    authCheck();
  }, [refreshToken, accessToken]);
  const context = useContext(MyContext);
  const { userData } = context;

  // console.log("Decoded User Data:", userData)

  // localStorage.setItem('bete', "Hello i am Shivam")

  // console.log(localStorage.getItem('bete'))

  // sessionStorage.setItem('bete2', "Hello i am Shivam")

  // console.log(sessionStorage.getItem('bete2'))
  // localStorage.removeItem('bete')
  // sessionStorage.removeItem('bete2')
  return (
    <nav className="bg-[#004e2e] shadow-md p-2 lg:p-1 sticky top-0 z-50">
      <div className="container mx-auto grid grid-cols-2 lg:grid-cols-5">
        {/* Mobile Menu */}
        {/* Logo */}
        <NavLink to="/" className="text-2xl text-white font-bold">
          <img src="/assets/logo/logo.png" alt="" />
        </NavLink>

        {/* Desktop Navigation */}
        <ul className="hidden col-span-3 lg:flex justify-center items-center text-white space-x-6 text-lg font-medium">
          <li>
            <NavLink to="/" className="hover:text-gray-300">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="hover:text-gray-300">
              About Us
            </NavLink>
          </li>

          <li>
            <NavLink to="/property" className="hover:text-gray-300">
              Property
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="hover:text-gray-300">
              Contact Us
            </NavLink>
          </li>
        </ul>

        <div className="flex items-center justify-end space-x-4">
          {/* <p>
            {isLoggedIn ? (
              <NavLink
                to="/dashboard"
                className="flex justify-center gap-2 items-center"
              >
                <Avatar>
                  <AvatarImage
                    src={userData?.avatar ? `http://localhost:4000/${userData?.avatar} ` : `https://cdn-icons-png.flaticon.com/512/9187/9187604.png`}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h2 className="text-white font-semibold uppercase">
                  {decodedUserData?.name}
                </h2>
              </NavLink>
            ) : (
              <NavLink to="/login" className={"text-white"}>
                <UserPlus className="h-6 w-6" />
              </NavLink>
            )}
          </p> */}
          {/* {isLoggedIn ? (
            <NavLink to="/contact" className="relative lg:block hidden">
              <ButtonCustom title="Sell Now" theme={"white"} />
            </NavLink>
          ) : (<NavLink to="/login" className="relative lg:block hidden">
            <ButtonCustom title="Sell Now" theme={"white"} />
          </NavLink>)} */}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden text-white">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6">
              <ul className="space-y-4 text-lg font-medium">
                <li>
                  <NavLink to="/" onClick={() => setIsOpen(false)}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/shop" onClick={() => setIsOpen(false)}>
                    Shop
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" onClick={() => setIsOpen(false)}>
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" onClick={() => setIsOpen(false)}>
                    Contact
                  </NavLink>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
