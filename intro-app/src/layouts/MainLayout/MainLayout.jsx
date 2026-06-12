import { Outlet } from "react-router-dom";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header.jsx";
import Slider from "../../components/module/Slider/Slider";
import Navbar from "../../components/layout/Navbar/Navbar.jsx";
import NavbarSticky from "../../components/layout/NavbarSticky/NavbarSticky.jsx";
import { MaintenanceGuard } from "../../app/guards";
import "./MainLayout.css";

const MainLayout = () => {
    return (
        <MaintenanceGuard>
            <Header >
                <NavbarSticky />
                <Navbar cart={false} />
                <Slider />
            </Header>

            <div className="main">
                <Outlet />
            </div>
            <Footer />
        </MaintenanceGuard>
    )
}

export default MainLayout;