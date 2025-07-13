import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import AcademyCategory from "@/pages/AcademyCategory";
import AcademyDashboard from "@/pages/AcademyDashboard";
import SalonServicesDashboard from "@/pages/SalonDashboard";
import RentInquiry from "@/pages/RentInquiry";
import InquiryDashboard from "@/pages/InquiryDasshboard";
import ProtectedRoute from "@/ProtectedRoute";
import ConstructionInquiry from "@/pages/ConstructionInquiry";
import GalleryPanel from "@/pages/Gallery";
import SalesInquiry from "@/pages/SalesInquiry";
import AddProperty from "@/pages/AddProperty";
import AllProperty from "@/pages/AllProperty";
import UserListing from "../pages/UserListing"
import AdminApprovalPage from "@/pages/ApprovalPage";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { path: "", element: <AcademyDashboard /> },
      { path: "academy_category", element: <AcademyCategory /> },
      { path: "salon_dashboard", element: <SalonServicesDashboard /> },
      { path: "all_property", element: <AllProperty /> },
      { path: "approval_property", element: <AdminApprovalPage /> },
      { path: "add_property", element: <AddProperty /> },
      // { path: "salon_service", element: <SalonCategory /> },
      { path: "acadmey_inquiry", element: <InquiryDashboard /> },
      { path: "sales_inquiry", element: <SalesInquiry /> },
      { path: "gallery", element: <GalleryPanel /> },
      {path: "user_listing", element: <UserListing/>},
      {path: "construction_inquiry", element: <ConstructionInquiry />},
      {path: "rent_inquiry", element: <RentInquiry />},
    ],
  },

  {
    path: "/inquiry-dashboard",
    element: <InquiryDashboard />,
  },

  { path: "/", element: <Login /> },
]);

export default router;
