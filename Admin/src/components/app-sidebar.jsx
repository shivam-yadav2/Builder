import {
  BookOpen,
  Building2,
  Frame,
  Home as HomeIcon,
  Image as ImageIcon,
  Plus,
  Wrench,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      title: "Gallery",
      url: "/dashboard/gallery",
      icon: ImageIcon,
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

  const logout = () => {
    const id = toast.loading("Logging Out ...");
    Cookies.remove("accessTokenAdmin");
    Cookies.remove("refreshToken");
    setTimeout(() => {
      navigate("/");
      toast.success("Logged Out Successfully", { id });
    }, 1000);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain />
        <NavProjects title="Dashboard" projects={data.projects} />
        <NavProjects title="Pages" projects={data.Pages} />
        <NavProjects title="Enquiries" projects={data.Enquiry} />
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
