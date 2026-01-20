import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
const MainLayout = () => {
  return (
    <>
      <TopBar />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
