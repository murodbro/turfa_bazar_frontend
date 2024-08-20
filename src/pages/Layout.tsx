import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import StoreNavigation from "../components/StoreNavigation";
import BreadCrumbs from "../components/BreadCrumbs";

const Layout = () => {
  return (
    <div>
      <StoreNavigation />
      <BreadCrumbs />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
