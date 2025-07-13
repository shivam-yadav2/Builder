import { Route, RouterProvider, Routes } from "react-router-dom";
import "./App.css";

import router from "./layout/Router";
import Layout from "./layout/Layout";
import InquiryDashboard from "./pages/InquiryDasshboard";
import MyState from "./context/MyState";
import ProtectedRoute from "./ProtectedRoute";

function App() {

  return (
    <>

         <MyState>

        <RouterProvider router={router} />


      </MyState>
      
    </>


  );
}

export default App;
