import React, { useState, useCallback, useContext } from "react";
import clsx from "clsx";
import { Container } from "@components/ui";
import { Sidebar } from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { RiLoginBoxLine, RiUserAddLine, RiLogoutBoxLine, RiUserLine, RiShoppingBagLine } from "react-icons/ri";

import Logo from "./components/Logo/Logo";
import Menu from "./components/Menu/Menu";
import Cart from "./components/Cart/Cart";
import { WishlistIcon } from "./components/WishlistIcon";
import { LangContext } from "../../../context/lang.jsx";
import { AVAILABLE_LANGS } from "../../../constants/lang.js";
import { AuthService } from "../../../services/auth.js";
import { useLang } from "@hooks/useLang";

import "./Navbar.css";

const Navbar = ({ className, bgColor }) => {
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
        "navbar__container",
        bgColor && `navbar__container-bgColor--${bgColor}`,
        className
    );

    return (
        <div className="navbar">
            <Sidebar isOpen={isOpen} onClose={closeMenu} />

            <Container>
                <div className={classes}>
                    <div className="navbar__nav">
                        <Logo />

                        <div className="navbar__menu-desktop">
                            <Menu />
                        </div>

                        <div className="navbar__actions">

                            <div className="navbar__lang-switcher">
                                <div className="navbar__lang-current">
                                    <span className={`fi fi-${getLang().flag}`} />
                                    <span className="navbar__lang-code">{getLang().code}</span>
                                </div>
                                <div className="navbar__lang-dropdown">
                                    {AVAILABLE_LANGS.map((l, idx) => (
                                        <div
                                            key={idx}
                                            className={clsx(
                                                "navbar__lang-item",
                                                l.code === getLang().label && "navbar__lang-item--active"
                                            )}
                                            onClick={() => handleLanguageChange(l.code)}
                                        >
                                            <span className={`fi fi-${l.flag}`} />
                                            <span className="navbar__lang-code">{l.code}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Profile or Auth - Desktop only */}
                            {isAuthenticated ? (
                                <div className="navbar__profile">
                                    <div className="navbar__profile-current">
                                        <div className="navbar__profile-avatar">
                                            {user?.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.first_name} className="navbar__profile-avatar-img" />
                                            ) : (
                                                <RiUserLine className="navbar__profile-avatar-icon" />
                                            )}
                                        </div>
                                        <span className="navbar__profile-name">
                                            {user?.first_name || 'User'}
                                        </span>
                                    </div>
                                    <div className="navbar__profile-dropdown">
                                        <button className="navbar__profile-item" onClick={() => handleNavigation('/profile')}>
                                            <RiUserLine className="navbar__profile-item-icon" />
                                            <span>{getTranslate("profile", "title")}</span>
                                        </button>
                                        <button className="navbar__profile-item" onClick={() => handleNavigation('/profile?tab=orders')}>
                                            <RiShoppingBagLine className="navbar__profile-item-icon" />
                                            <span>{getTranslate("profile", "orders")}</span>
                                        </button>
                                        <button className="navbar__profile-item navbar__profile-item--logout" onClick={handleLogout}>
                                            <RiLogoutBoxLine className="navbar__profile-item-icon" />
                                            <span>{getTranslate("profile", "logout")}</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="navbar__auth-buttons">
                                    <button className="navbar__auth-btn navbar__auth-btn--login" onClick={() => handleNavigation('/auth/login')} title={getTranslate("auth", "login")}>
                                        <RiLoginBoxLine className="navbar__auth-btn-icon" />
                                    </button>
                                    <button className="navbar__auth-btn navbar__auth-btn--register" onClick={() => handleNavigation('/auth/register')} title={getTranslate("auth", "register", "registerButton")}>
                                        <RiUserAddLine className="navbar__auth-btn-icon" />
                                    </button>
                                </div>
                            )}

                            <WishlistIcon />
                            <Cart />

                            <button
                                className={clsx(
                                    "navbar__burger",
                                    isOpen && "navbar__burger--active"
                                )}
                                onClick={toggleMenu}
                                type="button"
                            >
                                <span className="navbar__burger-line" />
                                <span className="navbar__burger-line" />
                                <span className="navbar__burger-line" />
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default React.memo(Navbar);