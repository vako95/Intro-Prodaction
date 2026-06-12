import { Outlet } from "react-router-dom";
import { Container, BackdropContainer } from "@components/ui";
import AuthNav from "../../components/module/AuthNav/AuthNav";
import "./AuthLayout.css";
import bgLogin from "./assets/img/page_bg.jpg"
import "./AuthLayout.css";

const AuthLayout = () => {
    return (

        <BackdropContainer
            backdrop={bgLogin}
            fullScreen={true}
        >
            <Container>
                <div className="auth__layout">
                    <AuthNav>
                        <Outlet />
                    </AuthNav>
                </div>
            </Container>
        </BackdropContainer>
    );
};

export default AuthLayout;
