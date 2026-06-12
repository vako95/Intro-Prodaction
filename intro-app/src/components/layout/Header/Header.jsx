import React, { useMemo } from "react";
import { BackdropContainer } from "@components/ui";
import { useLocation } from "react-router-dom";
import { backgroundImages } from "../../../constants/backdroundPages";
import pageBg from "./assets/img/page_bg.jpg";
import "./Header.css";

const Header = ({ children }) => {
    const location = useLocation();
    const currentBackground = useMemo(() => {
        return backgroundImages[location.pathname] || pageBg;
    }, [location.pathname]);

    return (
        <BackdropContainer
            attachment="fixed"
            // backdropHeight="80%"
            fullScreen={true}
            position="top"
            backdropFilter={true}
            backdrop={currentBackground}
        >
            <header className="header">
                {children}
            </header>
        </BackdropContainer>
    );
};

export default Header;
