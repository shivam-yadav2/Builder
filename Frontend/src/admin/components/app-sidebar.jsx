import {
  BookOpen,
  Building2,
  Frame,
  Home as HomeIcon,
  Image as ImageIcon,
  Plus,
  Wrench,
  Quote,
} from "lucide-react";
import { NavMain } from "@admin/components/nav-main";
import { NavProjects } from "@admin/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@admin/components/ui/sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";

const data = {
  projects: [
    {
      title: "Admin Dashboard",
      url: "/dashboard",
      icon: Frame,
    },
  ],
  Pages: [
    {
      title: "All Properties",
      url: "/dashboard/all_property",
      icon: Building2,
    },
    {
      title: "Add Property",
      url: "/dashboard/add_property",
      icon: Plus,
    },
    {
      title: "Showcase",
      url: "/dashboard/gallery",
      icon: ImageIcon,
    },
    {
      title: "Testimonials",
      url: "/dashboard/testimonials",
      icon: Quote,
    },
  ],
  Enquiry: [
    {
      title: "General Inquiry",
      url: "/dashboard/general_inquiry",
      icon: BookOpen,
    },
    {
      title: "Sales Inquiry",
      url: "/dashboard/sales_inquiry",
      icon: HomeIcon,
    },
    {
      title: "Rent Inquiry",
      url: "/dashboard/rent_inquiry",
      icon: HomeIcon,
    },
    {
      title: "Construction Inquiry",
      url: "/dashboard/construction_inquiry",
      icon: Wrench,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const [newEnquiries, setNewEnquiries] = useState(0);

  // Show a badge with the number of unhandled (New) general enquiries.
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/enquiry/get-enquiry`, {
        headers: { Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}` },
      })
      .then((res) => {
        const list = res.data?.data || [];
        const count = list.filter((e) => (e.status || "New") === "New").length;
        setNewEnquiries(count);
      })
      .catch(() => {
        /* ignore — badge just won't show */
      });
  }, []);

  const enquiryItems = data.Enquiry.map((item) =>
    item.url === "/dashboard/general_inquiry"
      ? { ...item, badge: newEnquiries }
      : item
  );

  const logout = () => {
    const id = toast.loading("Logging Out ...");
    Cookies.remove("accessTokenAdmin");
    Cookies.remove("refreshToken");
    setTimeout(() => {
      navigate("/admin");
      toast.success("Logged Out Successfully", { id });
    }, 1000);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain />
        <NavProjects title="Dashboard" projects={data.projects} />
        <NavProjects title="Pages" projects={data.Pages} />
        <NavProjects title="Enquiries" projects={enquiryItems} />
      </SidebarContent>
      <SidebarFooter>
        <button
          onClick={logout}
          className="w-full bg-red-600 border flex text-white text-base sm:text-lg items-center justify-center font-semibold gap-2 rounded-md p-2 hover:bg-red-700 transition-colors min-h-[44px]"
        >
          Logout
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
