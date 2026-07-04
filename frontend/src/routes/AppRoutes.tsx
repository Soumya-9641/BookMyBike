import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

/* User Pages */
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
import OnboardReturn from "../pages/onboarding/onboardReturn";
import ComingSoon from "../pages/ComingSoon";
import MyRefunds from "../pages/MyRefunds";
import MyListings from "../pages/MyListing";
import EditListing from "../pages/EditListings";
import UserAgreement from "../components/legal/UserAgreement";
import TermsOfService from "../components/legal/TermsOfService";
import DisputeResolution from "../components/legal/DisputeResolution";
import CancellationPolicy from "../components/legal/CancellationPolicy";

/* Admin Pages */
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDahbaord";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminUserBookings from "../pages/admin/AdminUserBookings";
import AdminDisputes from "../pages/admin/AdminDisputes";
import AdminDisputeDetail from "../pages/admin/AdminDisputeDetail";
import AdminChangePassword from "../components/admin/AdminChangePassword";
import AdminListings from "../pages/admin/AdminListings";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminEditListingModal from "../pages/admin/AdminEditListingModal";
import PrivacyPolicy from "../components/legal/PrivacyPolicy";
import HowItWorksFooter from "../components/HowItWorksFooter";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:userId" element={<AdminUserBookings />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="change-password" element={<AdminChangePassword />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="disputes/:disputeId" element={<AdminDisputeDetail />} />

          {/* ✅ ADMIN EDIT LISTING */}
          <Route
            path="edit-listing/:listingId"
            element={<AdminEditListingModal />}
          />
        </Route>
      </Route>

      {/* ================= USER APP ================= */}
      <Route element={<MainLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/browse-bikes" element={<BrowseBikes />} />
        <Route path="/bikes/:id" element={<BikeDetails />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/user-agreement" element={<UserAgreement />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/termsConditions" element={<TermsOfService />} />
        <Route path="/dispute-resolution" element={<DisputeResolution />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/how-it-works" element={<HowItWorksFooter />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedRoute requireOnboarded />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
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

          {/* ✅ USER EDIT LISTING (WITH HEADER & FOOTER) */}
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
