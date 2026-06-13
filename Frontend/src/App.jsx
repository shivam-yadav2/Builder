import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Smooth from "./utils/Smooth";
import MyState from "./context/MyState";
import Properties from "./pages/Properties";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import ScrollToTop from "./utils/ScrollTop";
import FilteredProperties from "./pages/FilteredProperties";
import Gallery from "./pages/Gallery";

// Admin is merged into this app but lazy-loaded, so public visitors never
// download the admin bundle — it only loads under /admin and /dashboard.
const AdminLayout = lazy(() => import("@admin/layout/Layout"));
const AdminLogin = lazy(() => import("@admin/pages/Login"));
const AcademyDashboard = lazy(() => import("@admin/pages/AcademyDashboard"));
const AllProperty = lazy(() => import("@admin/pages/AllProperty"));
const AddProperty = lazy(() => import("@admin/pages/AddProperty"));
const AdminGallery = lazy(() => import("@admin/pages/Gallery"));
const AdminTestimonials = lazy(() => import("@admin/pages/Testimonials"));
const InquiryDashboard = lazy(() => import("@admin/pages/InquiryDasshboard"));
const SalesInquiry = lazy(() => import("@admin/pages/SalesInquiry"));
const RentInquiry = lazy(() => import("@admin/pages/RentInquiry"));
const ConstructionInquiry = lazy(() => import("@admin/pages/ConstructionInquiry"));

const AdminFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-emerald-600" />
  </div>
);

function App() {
  return (
    <Smooth>
      <MyState>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<AdminFallback />}>
            <Routes>
              {/* Public site */}
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/property" element={<Properties />} />
              <Route path="/filtered-properties" element={<FilteredProperties />} />
              <Route path="/property-details/:type?/:id?" element={<PropertyDetailsPage />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<AcademyDashboard />} />
                <Route path="all_property" element={<AllProperty />} />
                <Route path="add_property" element={<AddProperty />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="general_inquiry" element={<InquiryDashboard />} />
                <Route path="sales_inquiry" element={<SalesInquiry />} />
                <Route path="rent_inquiry" element={<RentInquiry />} />
                <Route path="construction_inquiry" element={<ConstructionInquiry />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </MyState>
      <Toaster />
    </Smooth>
  );
}

export default App;
