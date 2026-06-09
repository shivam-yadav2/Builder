import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Login from "@/pages/Login";
import AcademyDashboard from "@/pages/AcademyDashboard";
import RentInquiry from "@/pages/RentInquiry";
import InquiryDashboard from "@/pages/InquiryDasshboard";
import ConstructionInquiry from "@/pages/ConstructionInquiry";
import GalleryPanel from "@/pages/Gallery";
import SalesInquiry from "@/pages/SalesInquiry";
import AddProperty from "@/pages/AddProperty";
import AllProperty from "@/pages/AllProperty";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { path: "", element: <AcademyDashboard /> },
      { path: "all_property", element: <AllProperty /> },
      { path: "add_property", element: <AddProperty /> },
      { path: "gallery", element: <GalleryPanel /> },
      { path: "general_inquiry", element: <InquiryDashboard /> },
      { path: "sales_inquiry", element: <SalesInquiry /> },
      { path: "rent_inquiry", element: <RentInquiry /> },
      { path: "construction_inquiry", element: <ConstructionInquiry /> },
    ],
  },

  { path: "/", element: <Login /> },
]);

export default router;
