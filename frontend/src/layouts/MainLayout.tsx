import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppLaunchNotice from "../components/AppLaunchNotice";
// import TopBar from "../components/TopBar";
const MainLayout = () => {
  return (
    <>
      {/* <TopBar /> */}
      <AppLaunchNotice />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
