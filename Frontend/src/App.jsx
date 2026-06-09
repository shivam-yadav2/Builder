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

function App() {
  return (
    <Smooth>
      <MyState>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/property" element={<Properties />} />
            <Route path="/filtered-properties" element={<FilteredProperties />} />
            <Route path="/property-details/:type?/:id?" element={<PropertyDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </MyState>
      <Toaster />
    </Smooth>
  );
}

export default App;
