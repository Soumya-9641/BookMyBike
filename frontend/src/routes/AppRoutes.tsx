import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import ComingSoon from "../pages/ComingSoon";
import MainLayout from "../layouts/MainLayout";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import CreateListing from "../pages/CreateListing";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import BrowseBikes from "../pages/BrowseBikes";
import BikeDetails from "../components/BikeDetailsPage";
import Checkout from "../pages/Checkout";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages WITH header & footer */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/browse-bikes" element={<BrowseBikes />} />
        <Route path="/bikes/:id" element={<BikeDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

      </Route>

      {/* Pages WITHOUT header & footer */}
      <Route path="/" element={<ComingSoon />} />
    </Routes>
  );
};

export default AppRoutes;
