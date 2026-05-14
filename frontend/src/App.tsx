import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthWatcher from "./components/Authwatcher";
import AdminAuthHydrator from "./components/AdminAuthHyderator";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthHydrator />
      <AuthWatcher />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
