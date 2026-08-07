import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthWatcher from "./components/Authwatcher";
import AdminAuthHydrator from "./components/AdminAuthHyderator";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";

function App() {
  return (
    <BrowserRouter>
    <CookieBanner />
      <ScrollToTop />
      <AdminAuthHydrator />
      <AuthWatcher />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
