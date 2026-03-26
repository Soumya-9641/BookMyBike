import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

/* Pages */
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import BrowseBikes from "../pages/BrowseBikes";
import BikeDetails from "../components/BikeDetailsPage";
import Checkout from "../pages/Checkout";
import CreateListing from "../pages/CreateListing";
import MyBookings from "../pages/MyBooking";
import OwnerBookings from "../pages/OwnerBookings";
import MyProfile from "../pages/MyProfile";
import ChangePassword from "../pages/ChangePassword";
import PaymentSuccess from "../pages/PaymentSuccess";
import VerifyEmail from "../pages/VerifyEmail";
import VerifyProfile from "../pages/VerifyProfile";
import OnboardingSuccess from "../pages/onboarding/success";
import OnboardingRefresh from "../pages/onboarding/refresh";
import ComingSoon from "../pages/ComingSoon";
import MyRefunds from "../pages/MyRefunds";
import MyListings from "../pages/MyListing";
import OnboardReturn from "../pages/onboarding/onboardReturn";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= Layout ================= */}
      <Route element={<MainLayout />}>

        {/* ---------- Public Routes ---------- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* ---------- Public Accessible ---------- */}
        <Route path="/home" element={<Home />} />
        <Route path="/browse-bikes" element={<BrowseBikes />} />
        <Route path="/bikes/:id" element={<BikeDetails />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ---------- Protected Routes ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/my-account" element={<MyProfile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/owner-bookings" element={<OwnerBookings />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/verify-profile" element={<VerifyProfile />} />
          <Route path="/onboardSuccess" element={<OnboardingSuccess />} />
          <Route path="/onboardRefresh" element={<OnboardingRefresh />} />
          <Route path="/onboardReturn" element={<OnboardReturn />} />
          <Route path="/my-refunds" element={<MyRefunds />} />
          <Route path="/my-listings" element={<MyListings />} />
        </Route>
      </Route>

      {/* ---------- No Layout ---------- */}
      <Route path="/" element={<ComingSoon />} />
    </Routes>
  );
};

export default AppRoutes;