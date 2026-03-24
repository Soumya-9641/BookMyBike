import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthWatcher from "./components/Authwatcher";

function App() {
  return (
    <BrowserRouter>
      <AuthWatcher />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
