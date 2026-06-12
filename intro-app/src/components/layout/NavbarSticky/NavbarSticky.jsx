import React, { useState, useCallback, useContext, useEffect } from "react";
import clsx from "clsx";
import { Container } from "@components/ui";
import { Sidebar } from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { RiLoginBoxLine, RiUserAddLine, RiLogoutBoxLine, RiUserLine, RiShoppingBagLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";

import Logo from "./components/Logo/Logo";
import Menu from "./components/Menu/Menu";
import Cart from "../Navbar/components/Cart/Cart";
import { WishlistIcon } from "../Navbar/components/WishlistIcon";
import { LangContext } from "../../../context/lang.jsx";
import { AVAILABLE_LANGS } from "../../../constants/lang.js";
import { AuthService } from "../../../services/auth.js";
import { useLang } from "@hooks/useLang";
import { useScroll } from "../../../hooks/useScroll";

import "./NavbarSticky.css";

const NavbarSticky = ({ className, bgColor }) => {
    const { visible } = useScroll(200);
    const [isOpen, setIsOpen] = useState(false);
    const { getLang, changeLanguage } = useContext(LangContext);
    const { getTranslate } = useLang();
    const navigate = useNavigate();
    
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();

    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleLanguageChange = useCallback((code) => {
        changeLanguage(code);
    }, [changeLanguage]);

    const handleLogout = useCallback(() => {
        AuthService.logout();
        navigate('/');
        window.location.reload();
    }, [navigate]);

    const handleNavigation = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    const classes = clsx(
        "navbar-sticky__container",
        bgColor && `navbar-sticky__container-bgColor--${bgColor}`,
        className
    );

    return (
        <AnimatePresence initial={false}>
            {visible && (
                <motion.div
                    className="navbar-sticky__wrapper"
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -60 }}
                    transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                >
                    <div className="navbar-sticky">
                        <Sidebar isOpen={isOpen} onClose={closeMenu} />

                        <Container>
                            <div className={classes}>
                                <div className="navbar-sticky__nav">
                                    <Logo />

                                    <div className="navbar-sticky__menu-desktop">
                                        <Menu />
                                    </div>

                                    <div className="navbar-sticky__actions">
                                        {/* Language Switcher - Desktop only */}
                                        <div className="navbar-sticky__lang-switcher">
                                            <div className="navbar-sticky__lang-current">
                                                <span className={`fi fi-${getLang().flag}`} />
                                                <span className="navbar-sticky__lang-code">{getLang().code}</span>
                                            </div>
                                            <div className="navbar-sticky__lang-dropdown">
                                                {AVAILABLE_LANGS.map((l, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={clsx(
                                                            "navbar-sticky__lang-item",
                                                            l.code === getLang().label && "navbar-sticky__lang-item--active"
                                                        )}
                                                        onClick={() => handleLanguageChange(l.code)}
                                                    >
                                                        <span className={`fi fi-${l.flag}`} />
                                                        <span className="navbar-sticky__lang-code">{l.code}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Profile or Auth - Desktop only */}
                                        {isAuthenticated ? (
                                            <div className="navbar-sticky__profile">
                                                <div className="navbar-sticky__profile-current">
                                                    <div className="navbar-sticky__profile-avatar">
                                                        {user?.avatar_url ? (
                                                            <img src={user.avatar_url} alt={user.first_name} className="navbar-sticky__profile-avatar-img" />
                                                        ) : (
                                                            <RiUserLine className="navbar-sticky__profile-avatar-icon" />
                                                        )}
                                                    </div>
                                                    <span className="navbar-sticky__profile-name">
                                                        {user?.first_name || 'User'}
                                                    </span>
                                                </div>
                                                <div className="navbar-sticky__profile-dropdown">
                                                    <button className="navbar-sticky__profile-item" onClick={() => handleNavigation('/profile')}>
                                                        <RiUserLine className="navbar-sticky__profile-item-icon" />
                                                        <span>{getTranslate("profile", "title")}</span>
                                                    </button>
                                                    <button className="navbar-sticky__profile-item" onClick={() => handleNavigation('/profile?tab=orders')}>
                                                        <RiShoppingBagLine className="navbar-sticky__profile-item-icon" />
                                                        <span>{getTranslate("profile", "orders")}</span>
                                                    </button>
                                                    <button className="navbar-sticky__profile-item navbar-sticky__profile-item--logout" onClick={handleLogout}>
                                                        <RiLogoutBoxLine className="navbar-sticky__profile-item-icon" />
                                                        <span>{getTranslate("profile", "logout")}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="navbar-sticky__auth-buttons">
                                                <button className="navbar-sticky__auth-btn navbar-sticky__auth-btn--login" onClick={() => handleNavigation('/auth/login')} title={getTranslate("auth", "login")}>
                                                    <RiLoginBoxLine className="navbar-sticky__auth-btn-icon" />
                                                </button>
                                                <button className="navbar-sticky__auth-btn navbar-sticky__auth-btn--register" onClick={() => handleNavigation('/auth/register')} title={getTranslate("auth", "register", "registerButton")}>
                                                    <RiUserAddLine className="navbar-sticky__auth-btn-icon" />
                                                </button>
                                            </div>
                                        )}

                                        <WishlistIcon />
                                        <Cart />
                                        
                                        <button
                                            className={clsx(
                                                "navbar-sticky__burger",
                                                isOpen && "navbar-sticky__burger--active"
                                            )}
                                            onClick={toggleMenu}
                                            type="button"
                                        >
                                            <span className="navbar-sticky__burger-line" />
                                            <span className="navbar-sticky__burger-line" />
                                            <span className="navbar-sticky__burger-line" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(NavbarSticky);
