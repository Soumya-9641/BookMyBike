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
import VerifyProfile from "../pages/VerifyProfile";
import OnboardingSuccess from "../pages/onboarding/success";
import OnboardingRefresh from "../pages/onboarding/refresh";
import PaymentSuccess from "../pages/PaymentSuccess";
import CompleteRideButton from "../components/CompleteRideButton";

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
                <Route path="/verify-profile" element={<VerifyProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-bookings/:bookingId" element={<CompleteRideButton />} />
        <Route path="/browse-bikes" element={<BrowseBikes />} />
        <Route path="/bikes/:id" element={<BikeDetails />} />
        <Route path="/onboardSuccess" element={<OnboardingSuccess />} />
        <Route path="/onboardRefresh" element={<OnboardingRefresh />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
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
