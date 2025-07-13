import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
  BookUser,
  HousePlus,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboards",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Fashion Academy Dashboard",
          url: "/dashboard",
        },
        {
          title: "Salon Dashboard",
          url: "/dashboard/salon_dashboard",
        },
      ],
    },
    {
      title: "Fashion Academy",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Course Category",
          url: "/dashboard/academy_category",
        },
        {
          title: "All Courses",
          url: "/dashboard/courses",
        },
        {
          title: "Add Courses",
          url: "/dashboard/add_course",
        },
      ],
    },
    {
      title: "Salon Services",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Salon Service",
          url: "/dashboard/salon_service",
        },
      ],
    },
  ],
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
      icon: PieChart,
    },
    {
      title: "Properties Approve Request",
      url: "/dashboard/approval_property",
      icon: PieChart,
    },
    {
      title: "Add Properties",
      url: "/dashboard/add_property",
      icon: Map,
    },
    {
      title: "Users",
      url: "/dashboard/user_listing",
      icon: User,
    },
  ],
  Enquiry: [
    {
      title: "Main Inquiry",
      url: "/dashboard/acadmey_inquiry",
      icon: BookOpen,
    },
    {
      title: "Construction Inquiry",
      url: "/dashboard/construction_inquiry",
      icon: Map,
    },
    {
      title: "Sales Inquiry",
      url: "/dashboard/sales_inquiry",
      icon: BookUser,
    },
    {
      title: "Rent Inquiry",
      url: "/dashboard/rent_inquiry",
      icon: HousePlus,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();

  const logout = () => {
    const id = toast.loading("Logging Out ...");

    Cookies.remove("accessTokenAdmin");
    Cookies.remove("accessTokenAdmin"); // Remove if used elsewhere
    Cookies.remove("refreshToken"); // Remove if used elsewhere
    setTimeout(() => {
      navigate("/");
      toast.success("Logged Out Successfully", { id });
    }, 1000);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain />
        <NavProjects title="Dashboard" projects={data.projects} />
        <NavProjects title="Pages" projects={data.Pages} />
        <NavProjects title="Enquiries" projects={data.Enquiry} />
      </SidebarContent>
      <SidebarFooter>
        <button
          onClick={logout}
          className="w-full bg-red-600 border flex text-white text-xl items-center justify-center font-semibold gap-2 rounded-md p-2 hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
